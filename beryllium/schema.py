from pydantic import BaseModel


class WebappNewSchema(BaseModel):
    name: str


class WebappSchema(WebappNewSchema):
    id: int
    status: str
    start_time: int

    class Config:
        from_attributes = True


class ProcessNewSchema(BaseModel):
    executable: str
    arguments: str


class ProcessSchema(ProcessNewSchema):
    id: int
    status: str
    start_time: int

    class Config:
        from_attributes = True
