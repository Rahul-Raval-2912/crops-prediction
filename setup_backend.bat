@echo off
echo Setting up Django Backend...

cd backend

echo Installing Python dependencies...
pip install -r requirements.txt

echo Running database migrations...
python manage.py makemigrations
python manage.py migrate

echo Creating superuser (optional - press Ctrl+C to skip)...
python manage.py createsuperuser

echo Populating sample crop data...
python manage.py populate_crops

echo Backend setup complete!
echo Run 'python manage.py runserver' to start the backend server
pause