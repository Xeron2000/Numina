import requests
import time
import random
import json
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

CITY_CODES = [
    "110000", "120000", "130100", "130200", "130300", "130400", "130500", "130600", "131200", "130800",
    "130900", "131000", "131100", "140100", "140200", "140300", "140400", "140500", "140600", "140700",
    "140800", "140900", "141000", "141100", "150100", "150200", "150300", "150400", "150500", "150600",
    "150700", "150800", "150900", "152200", "152500", "152900", "210100", "210200", "210300", "210400",
    "210500", "210600", "210700", "210800", "210900", "211000", "211100", "211200", "211300", "211400",
    "220100", "220200", "220300", "220400", "220500", "220600", "220700", "220800", "222400", "230100",
    "230200", "230300", "230400", "230500", "230600", "230700", "230800", "230900", "231000", "231100",
    "231200", "232700", "310000", "320100", "320200", "320300", "320400", "320500", "320600", "320700",
    "320800", "320900", "321000", "321100", "321200", "321300", "330100", "330200", "330300", "330400",
    "330500", "331300", "330700", "330800", "330900", "331000", "331100", "340100", "340200", "340300",
    "340400", "340500", "340600", "340700", "340800", "341000", "341100", "341200", "341300", "341500",
    "341600", "341700", "341800", "350100", "350200", "350300", "350400", "350500", "350600", "350700",
    "350800", "350900", "360100", "360200", "360300", "360400", "360500", "360600", "360700", "360800",
    "360900", "361000", "361100", "370100", "370200", "370300", "370400", "370500", "370600", "370700",
    "370800", "370900", "371000", "371100", "371300", "371400", "371500", "371600", "371700", "410100",
    "410200", "410300", "410400", "410500", "410600", "410700", "410800", "410900", "411000", "411100",
    "411200", "411300", "411400", "411500", "411600", "411700", "420100", "420200", "420300", "420500",
    "420600", "420700", "420800", "420900", "421000", "421100", "421200", "421300", "422800", "430100",
    "430200", "430300", "430400", "430500", "430600", "430700", "430800", "430900", "431000", "431100",
    "431200", "431300", "433100", "440100", "440200", "440300", "440400", "440500", "440600", "440700",
    "440800", "440900", "441200", "441300", "441400", "441500", "441600", "441700", "441800", "441900",
    "442000", "445100", "445200", "445300", "450100", "450200", "450300", "450400", "450500", "450600",
    "450700", "450800", "450900", "451000", "451100", "451200", "451300", "451400", "460100", "460200",
    "460400", "500000", "510100", "510300", "510400", "510500", "510600", "510700", "510800", "510900",
    "511000", "511100", "511300", "511400", "511500", "511600", "511700", "511800", "511900", "512000",
    "513200", "513300", "513400", "520100", "520200", "520300", "520400", "522400", "522200", "522300",
    "522600", "522700", "530100", "530300", "530400", "530500", "530600", "530700", "530800", "530900",
    "532301", "532522", "532621", "532801", "532901", "533103", "533321", "533421", "540100", "542300",
    "542100", "542600", "542200", "542400", "542500", "610100", "610200", "610300", "610400", "610500",
    "610600", "610700", "610800", "610900", "611000", "620100", "620200", "620300", "620400", "620500",
    "620600", "620700", "620800", "620900", "621000", "621100", "621200", "622900", "623000", "630100",
    "632100", "632200", "632300", "632500", "632700", "632800", "640100", "640200", "640300", "640400",
    "640500", "650100", "650200", "652100", "652200", "652300", "652700", "652800", "652900", "653000",
    "653100", "653200", "654000", "654200", "654300"
]

# Configuration parameters
REQUEST_TIMEOUT = 10
DELAY_RANGE = (0.2, 1)
MAX_WORKERS = 10

# Add request retry decorator
def retry(max_retries=2, delay=1):
    """Retry decorator with maximum retry count and delay interval"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            retries = 0
            while retries <= max_retries:
                try:
                    return func(*args, **kwargs)
                except Exception:
                    retries += 1
                    if retries > max_retries:
                        return None
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(max_retries=2, delay=1)
def fetch_data(session, code):
    """
    Get AQI data for a single city, with retry mechanism
    
    Args:
        session: requests session object
        code: city code
        
    Returns:
        JSON data on success, None on failure
    """
    url = f"https://air.cnemc.cn:18007/CityData/GetAQIDataPublishLiveInfo?cityCode={code}"
    try:
        response = session.post(url, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        return response.json()
    except (requests.exceptions.RequestException, json.JSONDecodeError):
        raise

cityKey = [
      "TimePoint",
      "Area",
      "CityCode",
      "CO",
      "NO2",
      "O3",
      "PM10",
      "PM2_5",
      "SO2",
      "AQI",
      "PrimaryPollutant",
      "Quality",
      "Measure",
      "Unheathful",
    ]

def worker(code, session):
    """Worker thread function to collect data and return results"""
    # Random delay to prevent too regular requests
    time.sleep(random.uniform(*DELAY_RANGE))
    
    data = fetch_data(session, code)
    if data:
        filtered_data = {key: data[key] for key in cityKey if key in data}
        return code, filtered_data
    return code, None

def batch_collect(city_codes):
    """
    Parallel batch data collection engine
    
    Args:
        city_codes: List of city codes to collect data for
        
    Returns:
        Dictionary containing metadata and collected data
    """
    collected_data = []
    success_count = 0
    failed_codes = []
    
    # Create a session for all threads to share
    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "application/json",
        "Referer": "https://air.cnemc.cn:18007/",
        "Origin": "https://air.cnemc.cn:18007"
    })
    
    # Create thread pool and submit tasks
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        # Submit collection tasks for all cities
        future_to_code = {
            executor.submit(worker, code, session): code for code in city_codes
        }
        
        # Process completed tasks
        for future in as_completed(future_to_code):
            code = future_to_code[future]
            try:
                code, data = future.result()
                
                if data:
                    collected_data.append(data)
                    success_count += 1
                else:
                    failed_codes.append(code)
                
            except Exception:
                failed_codes.append(code)
    
    # Return the collected data and metadata
    return collected_data


def collect_aqi_data():
    """
    Main function to collect AQI data
    
    Args:
        city_codes: List of city codes to collect data for
        
    Returns:
        Dictionary with collected data and metadata
    """
    try:
        result = batch_collect(CITY_CODES)
        return result
    except KeyboardInterrupt:
        return {"error": "User interrupted collection process"}
    except Exception as e:
        return {"error": str(e)}