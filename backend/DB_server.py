# DB_server.py
from sqlalchemy import create_engine, text

# ------------------------------------------------------
# ⚙️ Database connection settings
# ------------------------------------------------------
DB_USER = "postgres"       # change to your postgres username
DB_PASSWORD = "maipai"     # change to your postgres password
DB_HOST = "localhost"      # or the server IP
DB_PORT = "5432"           # default postgres port
DB_NAME = "postgres"       # change to your database name

# ------------------------------------------------------
# 🔗 Create SQLAlchemy Engine
# ------------------------------------------------------
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        now = conn.execute(text("SELECT NOW();")).fetchone()
        print(f"✅ Connected to Postgres, now: {now[0]}")
except Exception as e:
    print("❌ Database connection failed:", e)
    engine = None
