# Generated by Django 5.2 on 2025-05-28 07:39

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='event_date',
            field=models.CharField(max_length=16, validators=[django.core.validators.RegexValidator(regex='^\\d{2}\\.\\d{2}\\.\\d{4} --:--$')]),
        ),
    ]
