import time

from sqlalchemy import ForeignKey, Integer, String, Text, create_engine, INTEGER
from sqlalchemy.orm import relationship, mapped_column, Mapped, declarative_base, sessionmaker, Session as S

Base = declarative_base()


class Mixin:
    def str_helper(self, attribs:list[str]):
        attribs_full = ', '.join([f'{attrib}={getattr(self, attrib)!r}' for attrib in attribs])
        return f"{self.__class__.__name__}({attribs_full})"


get_current_timestamp = lambda: int(time.time())

class Webapp(Base, Mixin):
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

    def __str__(self):
        return self.str_helper(['id', 'name', 'status'])

    __repr__ = __str__


class Process(Base, Mixin):
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


engine = create_engine("sqlite:///db.sqlite3", echo=True)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine, class_=S)
