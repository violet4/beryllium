import time

from fastapi import FastAPI, APIRouter, Depends, Body, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound

from .status_enum import NotRunningStatus
from .models import Session as SessionMaker, Webapp, Process
from .schema import WebappSchema, WebappNewSchema, ProcessNewSchema, ProcessSchema

app = FastAPI()

router = APIRouter()


def get_db():
    db = SessionMaker()
    try:
        yield db
    finally:
        db.close()


@router.get("/apps", response_model=list[WebappSchema])
async def list_webapps(sess:Session=Depends(get_db)):
    return [WebappSchema.model_validate(wa) for wa in sess.query(Webapp)]


@router.get("/apps/{app_name}", response_model=WebappSchema)
async def get_webapp(app_name: str, sess:Session=Depends(get_db)):
    webapp = sess.query(Webapp).where(Webapp.name==app_name).one_or_none()
    if webapp:
        return WebappSchema.model_validate(webapp)
    return {"error": "Webapp not found"}, 404


@router.post("/apps", response_model=WebappSchema)
async def create_webapp(webappNew:WebappNewSchema=Body(...), sess:Session=Depends(get_db)):
    webapp = sess.query(Webapp).filter(Webapp.name == webappNew.name).first()
    if webapp is not None:
        raise HTTPException(400, "A webapp by that name already exists")
    webapp = Webapp(
        name=webappNew.name,
        status="stopped",
    )
    sess.add(webapp)
    sess.commit()
    sess.refresh(webapp)
    return WebappSchema.model_validate(webapp)


@router.post("/apps/{app_name}")
async def start_webapp(app_name: str, sess:Session=Depends(get_db)):
    webapp = sess.query(Webapp).filter(Webapp.name==app_name).first()
    if webapp is None:
        raise HTTPException(404, "No webapp with that name")
    webapp.start(sess, commit=False)
    sess.commit()
    sess.refresh(webapp)
    return WebappSchema.model_validate(webapp)


@router.put("/apps/{app_name}")
async def stop_webapp(app_name: str, sess:Session=Depends(get_db)):
    webapp = sess.query(Webapp).filter(Webapp.name==app_name).first()
    if webapp is None:
        raise HTTPException(404, "No webapp with that name")
    webapp.terminate(sess, commit=False)
    sess.commit()
    sess.refresh(webapp)
    return WebappSchema.model_validate(webapp)


@router.delete("/apps/{app_name}")
async def delete_webapp(app_name: str, sess:Session=Depends(get_db)):
    webapp = sess.query(Webapp).filter(Webapp.name == app_name).first()
    if webapp is None:
        raise HTTPException(status_code=404, detail="Webapp not found")
    sess.delete(webapp)
    sess.commit()
    return {"message": "Webapp deleted successfully"}


## Processes


@router.get("/processes/{webapp_id}", response_model=list[ProcessSchema])
async def list_processes(webapp_id: int, sess: Session = Depends(get_db)):
    processes = sess.query(Process).filter(Process.webapp_id == webapp_id).all()
    return [ProcessSchema.model_validate(process) for process in processes]


@router.post("/processes/{webapp_id}", response_model=ProcessSchema)
async def create_process(webapp_id: int, processNew: ProcessNewSchema = Body(...), sess: Session = Depends(get_db)):
    webapp = sess.query(Webapp).filter(Webapp.id == webapp_id).first()
    if webapp is None:
        raise HTTPException(status_code=404, detail="Webapp not found")
    process = Process(
        webapp_id=webapp_id,
        executable=processNew.executable,
        arguments=processNew.arguments,
        cwd=processNew.cwd,
        status=NotRunningStatus.NEW,
        start_time=int(time.time())
    )
    sess.add(process)
    sess.commit()
    sess.refresh(process)
    return ProcessSchema.model_validate(process)


@router.post("/processes/start/{process_id}", response_model=ProcessSchema)
async def start_process(process_id: int, sess: Session = Depends(get_db)):
    process = sess.query(Process).filter(Process.id == process_id).first()
    if process is None:
        raise HTTPException(404, "No process with that ID")
    process.start(sess)
    sess.refresh(process)
    return ProcessSchema.model_validate(process)


@router.put("/processes/stop/{process_id}", response_model=ProcessSchema)
async def stop_process(process_id: int, sess: Session = Depends(get_db)):
    process = sess.query(Process).filter(Process.id == process_id).first()
    if process is None:
        raise HTTPException(404, "No process with that ID")
    process.terminate(sess)
    sess.refresh(process)
    return ProcessSchema.model_validate(process)


@router.delete("/processes/{process_id}")
async def delete_process(process_id: int, sess: Session = Depends(get_db)):
    process = sess.query(Process).filter(Process.id == process_id).first()
    if process is None:
        raise HTTPException(status_code=404, detail="Process not found")
    sess.delete(process)
    sess.commit()
    return {"message": "Process deleted successfully"}


app.include_router(router)
