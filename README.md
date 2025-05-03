# Django Admin Hotkeys

Add hotkeys to the Django admin interface to improve your workflow.

![django-admin-hotkeys demo screenshot](https://repository-images.githubusercontent.com/977099141/42f0d207-c575-40d8-adbb-78cd7b795248)

[![PyPi Version](https://img.shields.io/pypi/v/django-admin-hotkeys.svg)](https://pypi.python.org/pypi/django-admin-hotkeys/)
[![GitHub License](https://img.shields.io/github/license/amureki/django-admin-hotkeys)](https://raw.githubusercontent.com/amureki/django-admin-hotkeys/main/LICENSE)

## Usage

1. `pip install django-admin-hotkeys`
2. Add `django_admin_hotkeys` to your `INSTALLED_APPS` in `settings.py` and make sure it's before `django.contrib.admin`:
   ```python
   INSTALLED_APPS = [
       ...
       "django_admin_hotkeys",
       "django.contrib.admin",
       ...
   ]
   ```
3. PROFIT!

## Hotkeys

- `/`: Focus the search box
- `n`: Navigate to "Add" page to create a new item
