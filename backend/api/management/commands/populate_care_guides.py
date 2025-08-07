from django.core.management.base import BaseCommand
from api.models import Crop, CropCareGuide

class Command(BaseCommand):
    help = 'Populate database with crop care guides'

    def handle(self, *args, **options):
        # Rice care guide
        rice = Crop.objects.get(name='Rice')
        rice_guides = [
            {'week': 1, 'stage': 'Land Preparation', 'instruction': 'Prepare field by plowing and leveling. Flood the field with 2-3 inches of water.', 'tips': 'Ensure proper drainage system is in place'},
            {'week': 2, 'stage': 'Transplanting', 'instruction': 'Transplant 20-25 day old seedlings with 20x15 cm spacing.', 'tips': 'Handle seedlings carefully to avoid root damage'},
            {'week': 4, 'stage': 'Early Growth', 'instruction': 'Maintain water level at 2-5 cm. Apply first dose of nitrogen fertilizer.', 'tips': 'Remove weeds manually or use herbicides'},
            {'week': 8, 'stage': 'Tillering', 'instruction': 'Apply second dose of nitrogen. Monitor for pests like stem borer.', 'tips': 'Drain field for 2-3 days if excessive tillering occurs'},
            {'week': 12, 'stage': 'Flowering', 'instruction': 'Maintain continuous flooding. Apply final dose of fertilizer.', 'tips': 'Critical stage - avoid water stress'},
            {'week': 16, 'stage': 'Grain Filling', 'instruction': 'Reduce water level gradually. Monitor for diseases.', 'tips': 'Apply fungicides if brown spot or blast appears'},
            {'week': 18, 'stage': 'Harvesting', 'instruction': 'Harvest when 80% grains turn golden yellow.', 'tips': 'Dry grains to 14% moisture content for storage'}
        ]
        
        for guide in rice_guides:
            CropCareGuide.objects.get_or_create(
                crop=rice,
                week_number=guide['week'],
                defaults={
                    'stage': guide['stage'],
                    'care_instruction': guide['instruction'],
                    'tips': guide['tips']
                }
            )

        # Wheat care guide
        wheat = Crop.objects.get(name='Wheat')
        wheat_guides = [
            {'week': 1, 'stage': 'Sowing', 'instruction': 'Sow seeds at 2-3 cm depth with 20 cm row spacing.', 'tips': 'Use certified seeds for better yield'},
            {'week': 3, 'stage': 'Germination', 'instruction': 'Ensure adequate moisture. Apply pre-emergence herbicide.', 'tips': 'Light irrigation if rainfall is insufficient'},
            {'week': 6, 'stage': 'Tillering', 'instruction': 'Apply first dose of nitrogen fertilizer. Light irrigation.', 'tips': 'Remove weeds manually between rows'},
            {'week': 10, 'stage': 'Stem Extension', 'instruction': 'Apply second dose of nitrogen. Monitor for aphids.', 'tips': 'Spray insecticide if aphid population exceeds threshold'},
            {'week': 14, 'stage': 'Flowering', 'instruction': 'Ensure adequate soil moisture. Apply fungicide for rust prevention.', 'tips': 'Critical period for water requirement'},
            {'week': 16, 'stage': 'Grain Filling', 'instruction': 'Maintain soil moisture. Monitor for grain-eating birds.', 'tips': 'Use bird scarers or nets if necessary'},
            {'week': 18, 'stage': 'Harvesting', 'instruction': 'Harvest when grains are hard and moisture is 20-25%.', 'tips': 'Harvest early morning to reduce grain shattering'}
        ]
        
        for guide in wheat_guides:
            CropCareGuide.objects.get_or_create(
                crop=wheat,
                week_number=guide['week'],
                defaults={
                    'stage': guide['stage'],
                    'care_instruction': guide['instruction'],
                    'tips': guide['tips']
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully populated crop care guides'))