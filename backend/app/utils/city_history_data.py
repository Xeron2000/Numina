import requests
import time

def get_cityhistory_data(citycode):
    try:
        url1 = f'https://air.cnemc.cn:18007/HourChangesPublish/GetCityRealTimeAqiHistoryByCondition?citycode={citycode}'
        url2 = f'https://air.cnemc.cn:18007/HourChangesPublish/GetCityDayAqiHistoryByCondition?citycode={citycode}'
        
        headers = {
                "User-Agent": "Mozilla/5.0",
                "X-Requested-With": "XMLHttpRequest",
                "Referer": "https://air.cnemc.cn:18007/",
        }
        print('das')
        response1 = requests.post(url1, headers=headers)
        time.sleep(0.1)
        response2 = requests.post(url2, headers=headers)
        response = {"hour":response1.json(),"day":response2.json()}

    except Exception as e:
        print(f"Error processing response: {e}")
        raise HTTPException(status_code=500, detail="Failed to process city history data")

    return response