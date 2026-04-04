from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, create_engine
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import uuid

Base = declarative_base()

def generate_uuid():
    """Helper functional wrapper to instantiate UUID strings properly within models."""
    return str(uuid.uuid4())

class Worker(Base):
    __tablename__ = "workers"

    worker_id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False, default="Unknown Worker")
    platform = Column(String, nullable=False) # Zepto, Blinkit, Swiggy, Amazon Flex
    city = Column(String, nullable=False)
    daily_income = Column(Float, nullable=False)
    
    # Relationships
    policies = relationship("Policy", back_populates="worker", cascade="all, delete-orphan")

class Policy(Base):
    __tablename__ = "policies"

    policy_id = Column(String, primary_key=True, default=generate_uuid)
    worker_id = Column(String, ForeignKey("workers.worker_id"), nullable=False)
    policy_status = Column(String, default="active") # active, expired, cancelled
    coverage_type = Column(String, nullable=False)
    coverage_amount = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    worker = relationship("Worker", back_populates="policies")
    claims = relationship("Claim", back_populates="policy", cascade="all, delete-orphan")

class Claim(Base):
    __tablename__ = "claims"

    claim_id = Column(String, primary_key=True, default=generate_uuid)
    policy_id = Column(String, ForeignKey("policies.policy_id"), nullable=False)
    claim_amount = Column(Float, nullable=False)
    status = Column(String, default="investigating") # approved, denied, investigating
    fraud_flag = Column(Boolean, default=False)
    trigger_reason = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    policy = relationship("Policy", back_populates="claims")
    payout = relationship("Payout", back_populates="claim", uselist=False, cascade="all, delete-orphan")

class Payout(Base):
    __tablename__ = "payouts"
    
    payout_id = Column(String, primary_key=True, default=generate_uuid)
    claim_id = Column(String, ForeignKey("claims.claim_id"), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, default="pending") # processing, completed, failed
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    claim = relationship("Claim", back_populates="payout")

# Quick wiring snippet to initialize db synchronously during local testing
engine = create_engine("sqlite:///./gigshield.db", connect_args={"check_same_thread": False})
Base.metadata.create_all(bind=engine)
