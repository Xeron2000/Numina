from fastapi import HTTPException
from starlette import status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List

class ErrorResponse(BaseModel):
    code: int
    message: str
    errors: Optional[List] = None

class APIException(Exception):
    def __init__(
        self,
        code: int = 400,
        message: str = "请求错误",
        errors: Optional[List] = None
    ):
        self.code = code
        self.message = message
        self.errors = errors

    def response(self):
        return JSONResponse(
            status_code=self.code,
            content={
                "code": self.code,
                "message": self.message,
                "errors": self.errors or []
            }
        )

class FileTooLargeException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds 100MB limit"
        )

class InvalidFileTypeException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only CSV and Excel files are allowed"
        )

class DatabaseConnectionException(HTTPException):
    def __init__(self, detail: str = "Database connection failed"):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=detail
        )

class DatasetNotFoundException(HTTPException):
    def __init__(self, dataset_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dataset with id {dataset_id} not found"
        )

class CredentialsException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )