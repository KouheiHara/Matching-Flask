import os
from datetime import datetime
from contextlib import contextmanager
from sqlalchemy.dialects.mysql import (
    INTEGER, DATETIME, VARCHAR
)
from sqlalchemy import create_engine, Column, event, exc, ForeignKey
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relation, scoped_session, sessionmaker
from sqlalchemy.pool import Pool
from matching_app import app

BASE = declarative_base()

@event.listens_for(Pool, "checkout")
def ping_connection(dbapi_connection, connection_record, connection_proxy):
    cursor = dbapi_connection.cursor()
    try:
        cursor.execute("SELECT 1")
    except:
        raise exc.DisconnectionError()
    finally:
        cursor.close()

host = app.config.get("DB_HOST")
database = app.config.get("DB_DATABASE")
user = app.config.get("DB_USER")
password = app.config.get("DB_PASSWORD")

url = f"mysql+pymysql://{user}:{password}@{host}/{database}?charset=utf8mb4"

echo = app.config.get("DB_DEBUG")
pool_recycle = int(app.config.get("DB_POOL_RECYCLE"))

engine = create_engine(
    url,
    echo=echo,
    pool_recycle=pool_recycle
)

@contextmanager
def session_scope():
    session_cls = scoped_session(sessionmaker(
        bind=engine,
        autocommit=False,
        autoflush=True,
        expire_on_commit=False
    ))

    session = session_cls()
    try:
        yield session
    except SQLAlchemyError as e:
        session.rollback()
        raise e
    except Exception as e:
        session.rollback()
        raise e
    finally:
        if session is not None:
            session.close()

class User(BASE):
    __tablename__ = "users"

    id = Column(INTEGER(11), primary_key=True, autoincrement=True, nullable=False)
    twitter_user_id = Column(VARCHAR(255), nullable=False)
    twitter_user_name = Column(VARCHAR(255), nullable=False)
    like = Column(INTEGER(11), nullable=True, default=0)
    dislike = Column(INTEGER(11), nullable=True, default=0)
    created_at = Column(DATETIME, nullable=True, default=datetime.now)
    updated_at = Column(DATETIME, nullable=True, default=datetime.now, onupdate=datetime.now)

    def __repr__(self):
        return f'<User id: {self.id}>'