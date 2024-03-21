import signal
import time
import subprocess
import os
import shlex

from sqlalchemy import ForeignKey, Integer, String, Text, create_engine, INTEGER
from sqlalchemy.orm import relationship, mapped_column, Mapped, declarative_base, sessionmaker, Session as S

from .status_enum import RunningStatus, NotRunningStatus

Base = declarative_base()


class ModelHelpers:
    def str_helper(self, attribs:list[str]):
        attribs_full = ', '.join([f'{attrib}={getattr(self, attrib)!r}' for attrib in attribs])
        return f"{self.__class__.__name__}({attribs_full})"


get_current_timestamp = lambda: int(time.time())

class Webapp(Base, ModelHelpers):
    __tablename__ = "webapp"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    start_time: Mapped[int] = mapped_column(Integer, default=get_current_timestamp)
    status: Mapped[str] = mapped_column(String(20))

    processes: Mapped[list['Process']] = relationship(
        "Process",
        back_populates="webapp",
        cascade="all, delete",
    )

    def __init__(self, *args, **kwargs):
        self.start_time = get_current_timestamp()
        super().__init__(*args, **kwargs)

    def start(self, sess:S, commit=True):
        for proc in self.processes:
            if not isinstance(proc.status, RunningStatus):
                proc.start(sess, commit=commit)
        self.status = RunningStatus.STARTED
        self.start_time = int(time.time())
        if commit:
            sess.commit()

    def terminate(self, sess:S, commit=True):
        for proc in self.processes:
            if not isinstance(proc.status, NotRunningStatus):
                proc.terminate(sess, commit=commit)
        self.status = NotRunningStatus.TERMINATED
        if commit:
            sess.commit()

    def __str__(self):
        return self.str_helper(['id', 'name', 'status'])

    __repr__ = __str__


class Process(Base, ModelHelpers):
    __tablename__ = "process"

    id: Mapped[int] = mapped_column(primary_key=True)
    webapp_id: Mapped[int] = mapped_column(ForeignKey('webapp.id'), nullable=False)
    pid: Mapped[int|None] = mapped_column(Integer, nullable=True)
    start_time: Mapped[int] = mapped_column(INTEGER, default=get_current_timestamp)
    executable: Mapped[str] = mapped_column(String(200))
    cwd: Mapped[str] = mapped_column(Text)
    arguments: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20))

    webapp: Mapped[Webapp] = relationship("Webapp", back_populates="processes")

    def __str__(self):
        return self.str_helper(['id', 'webapp_id', 'pid', 'start_time', 'executable', 'cwd', 'arguments', 'status'])

    __repr__ = __str__

    def start(self, sess:S, commit=True):
        # process starts immediately
        proc = subprocess.Popen(
            args=[self.executable]+shlex.split(self.arguments),
            cwd=os.path.expanduser(self.cwd),
            preexec_fn=os.setsid,
        )
        self.pid = proc.pid
        self.status = RunningStatus.STARTED
        self.start_time = int(time.time())
        if commit:
            sess.commit()

    def terminate(self, sess:S, commit=True):
        if self.pid is not None:
            os.kill(self.pid, signal.SIGTERM)
            #TODO:check if it actually terminated under the hood or if it failed to terminate?
            self.status = NotRunningStatus.TERMINATED
            if commit:
                sess.commit()


engine = create_engine("sqlite:///db.sqlite3", echo=True)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine, class_=S)
