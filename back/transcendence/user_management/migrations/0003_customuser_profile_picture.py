# Generated by Django 5.0.7 on 2024-08-05 12:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0002_customuser_bio'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='profile_picture',
            field=models.ImageField(default='default.jpg', upload_to='profile_pictures/'),
        ),
    ]
