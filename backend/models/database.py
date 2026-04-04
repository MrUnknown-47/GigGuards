from typing import Dict, Any

class MockDB:
    def __init__(self):
        self.workers: Dict[str, Any] = {}
        self.policies: Dict[str, Any] = {}
        self.claims: Dict[str, Any] = {}

    def get_worker(self, worker_id: str):
        return self.workers.get(worker_id)
        
    def add_worker(self, worker_id: str, data: Any):
        self.workers[worker_id] = data

    def get_policy(self, policy_id: str):
        return self.policies.get(policy_id)

    def add_policy(self, policy_id: str, data: Any):
        self.policies[policy_id] = data
        
    def get_claim(self, claim_id: str):
        return self.claims.get(claim_id)

    def add_claim(self, claim_id: str, data: Any):
        self.claims[claim_id] = data

db = MockDB()