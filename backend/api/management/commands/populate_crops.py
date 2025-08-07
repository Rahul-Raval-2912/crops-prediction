from django.core.management.base import BaseCommand
from api.models import Crop

class Command(BaseCommand):
    help = 'Populate database with sample crop data'

    def handle(self, *args, **options):
        crops_data = [
            {
                'name': 'Rice',
                'season': 'Kharif',
                'min_temperature': 20,
                'max_temperature': 35,
                'min_humidity': 60,
                'max_humidity': 80,
                'min_ph': 5.5,
                'max_ph': 7.0,
                'min_rainfall': 1000,
                'max_rainfall': 2000,
                'soil_type': 'Clay, Loamy',
                'growth_period': 120,
                'care_instructions': 'Plant in flooded fields. Maintain water level 2-5cm. Apply nitrogen fertilizer in 3 splits. Control weeds manually or with herbicides. Harvest when grains are golden yellow.'
            },
            {
                'name': 'Wheat',
                'season': 'Rabi',
                'min_temperature': 10,
                'max_temperature': 25,
                'min_humidity': 50,
                'max_humidity': 70,
                'min_ph': 6.0,
                'max_ph': 7.5,
                'min_rainfall': 300,
                'max_rainfall': 800,
                'soil_type': 'Loamy, Sandy loam',
                'growth_period': 110,
                'care_instructions': 'Sow in well-prepared seedbed. Apply balanced fertilizer. Irrigate at critical stages. Control rust and aphids. Harvest when moisture content is 14-16%.'
            },
            {
                'name': 'Maize',
                'season': 'Kharif/Rabi',
                'min_temperature': 18,
                'max_temperature': 32,
                'min_humidity': 60,
                'max_humidity': 80,
                'min_ph': 5.8,
                'max_ph': 7.8,
                'min_rainfall': 500,
                'max_rainfall': 1200,
                'soil_type': 'Well-drained loamy',
                'growth_period': 90,
                'care_instructions': 'Plant in rows 60cm apart. Apply organic manure. Side-dress with nitrogen. Control stem borer and fall armyworm. Harvest when kernels are hard.'
            },
            {
                'name': 'Cotton',
                'season': 'Kharif',
                'min_temperature': 21,
                'max_temperature': 35,
                'min_humidity': 50,
                'max_humidity': 80,
                'min_ph': 5.8,
                'max_ph': 8.0,
                'min_rainfall': 500,
                'max_rainfall': 1000,
                'soil_type': 'Black cotton soil, Alluvial',
                'growth_period': 180,
                'care_instructions': 'Deep plowing required. Apply phosphorus at sowing. Regular irrigation needed. Control bollworm and whitefly. Hand-pick cotton when bolls open.'
            },
            {
                'name': 'Sugarcane',
                'season': 'Annual',
                'min_temperature': 20,
                'max_temperature': 35,
                'min_humidity': 70,
                'max_humidity': 85,
                'min_ph': 6.0,
                'max_ph': 7.5,
                'min_rainfall': 1000,
                'max_rainfall': 1500,
                'soil_type': 'Deep fertile loamy',
                'growth_period': 365,
                'care_instructions': 'Plant healthy seed canes. Apply heavy doses of organic manure. Regular irrigation essential. Earthing up at 4-5 months. Control red rot and smut diseases.'
            },
            {
                'name': 'Tomato',
                'season': 'Rabi/Summer',
                'min_temperature': 18,
                'max_temperature': 29,
                'min_humidity': 60,
                'max_humidity': 80,
                'min_ph': 6.0,
                'max_ph': 7.0,
                'min_rainfall': 400,
                'max_rainfall': 800,
                'soil_type': 'Well-drained sandy loam',
                'growth_period': 75,
                'care_instructions': 'Start with nursery seedlings. Transplant after 4-5 weeks. Provide support stakes. Regular watering needed. Control blight and fruit borer. Harvest when fruits turn red.'
            },
            {
                'name': 'Potato',
                'season': 'Rabi',
                'min_temperature': 15,
                'max_temperature': 25,
                'min_humidity': 80,
                'max_humidity': 90,
                'min_ph': 5.2,
                'max_ph': 6.4,
                'min_rainfall': 500,
                'max_rainfall': 700,
                'soil_type': 'Sandy loam, Loamy',
                'growth_period': 90,
                'care_instructions': 'Plant certified seed tubers. Hill up soil around plants. Apply balanced fertilizer. Control late blight and aphids. Harvest when plants yellow and die back.'
            },
            {
                'name': 'Onion',
                'season': 'Rabi',
                'min_temperature': 13,
                'max_temperature': 24,
                'min_humidity': 70,
                'max_humidity': 80,
                'min_ph': 6.0,
                'max_ph': 7.5,
                'min_rainfall': 400,
                'max_rainfall': 600,
                'soil_type': 'Well-drained sandy loam',
                'growth_period': 120,
                'care_instructions': 'Raise seedlings in nursery. Transplant at 6-8 weeks. Apply sulfur for bulb development. Control thrips and purple blotch. Harvest when tops fall over.'
            }
        ]

        for crop_data in crops_data:
            crop, created = Crop.objects.get_or_create(
                name=crop_data['name'],
                defaults=crop_data
            )
            if created:
                self.stdout.write(f'Created crop: {crop.name}')
            else:
                self.stdout.write(f'Crop already exists: {crop.name}')

        self.stdout.write(self.style.SUCCESS('Successfully populated crops data'))