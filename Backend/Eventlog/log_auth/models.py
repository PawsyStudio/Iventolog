# models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class IventlogUser(AbstractUser):
    telegram_id = models.CharField(max_length=100, unique=True)
    
    REQUIRED_FIELDS = ['telegram_id', 'email'] 

    def __str__(self):
        return self.username