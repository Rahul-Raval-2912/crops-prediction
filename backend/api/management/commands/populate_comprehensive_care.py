from django.core.management.base import BaseCommand
from api.models import Crop, CropCareGuide

class Command(BaseCommand):
    help = 'Populate comprehensive crop care guides for all crops'

    def handle(self, *args, **options):
        # Clear existing guides
        CropCareGuide.objects.all().delete()
        
        crops_care_data = {
            'Rice': [
                {'week': 1, 'stage': 'Land Preparation', 'instruction': 'Prepare field by deep plowing 15-20 cm. Level the field properly. Create bunds around field. Apply 10-15 tons of farmyard manure per hectare.', 'tips': 'Ensure proper drainage channels. Remove all weeds and crop residues.'},
                {'week': 2, 'stage': 'Nursery Preparation', 'instruction': 'Prepare nursery bed with fine tilth. Soak seeds for 24 hours, then incubate for 48 hours. Sow pre-germinated seeds in nursery.', 'tips': 'Use 40-50 kg seeds per hectare. Maintain 2-3 cm water level in nursery.'},
                {'week': 3, 'stage': 'Seedling Care', 'instruction': 'Maintain water level in nursery. Apply urea 10g/m² after 10 days. Remove weeds manually. Monitor for pests.', 'tips': 'Healthy seedlings should be 20-25 cm tall with 4-5 leaves.'},
                {'week': 4, 'stage': 'Field Flooding', 'instruction': 'Flood main field with 5-7 cm water. Apply basal fertilizer: 60 kg N, 30 kg P₂O₅, 30 kg K₂O per hectare.', 'tips': 'Water should be muddy consistency for better weed control.'},
                {'week': 5, 'stage': 'Transplanting', 'instruction': 'Transplant 25-30 day old seedlings. Use 2-3 seedlings per hill. Maintain 20×15 cm spacing. Plant at 2-3 cm depth.', 'tips': 'Transplant in evening or cloudy weather. Handle seedlings gently.'},
                {'week': 6, 'stage': 'Early Establishment', 'instruction': 'Maintain 2-5 cm water level. Apply first top dressing of nitrogen (30 kg/ha) after 15 days of transplanting.', 'tips': 'Drain field if seedlings show yellowing. Refill after 2-3 days.'},
                {'week': 8, 'stage': 'Tillering Stage', 'instruction': 'Apply second nitrogen dose (30 kg/ha). Maintain shallow water. Remove weeds manually or use herbicide.', 'tips': 'Maximum tillering occurs now. Avoid deep water which reduces tillering.'},
                {'week': 10, 'stage': 'Active Tillering', 'instruction': 'Monitor for stem borer, leaf folder. Apply insecticide if needed. Maintain water level at 3-5 cm.', 'tips': 'Install pheromone traps for stem borer monitoring.'},
                {'week': 12, 'stage': 'Panicle Initiation', 'instruction': 'Apply final nitrogen dose if needed. Maintain continuous flooding. Monitor for brown plant hopper.', 'tips': 'Critical stage for water - never let field dry completely.'},
                {'week': 14, 'stage': 'Booting Stage', 'instruction': 'Maintain 5-10 cm water level. Apply potash if deficiency symptoms appear. Monitor for blast disease.', 'tips': 'Spray fungicide preventively for blast control in susceptible varieties.'},
                {'week': 16, 'stage': 'Flowering', 'instruction': 'Maintain continuous flooding. Avoid pesticide application during flowering. Monitor for case worm.', 'tips': 'Most critical stage for water. Even 1 day of water stress reduces yield significantly.'},
                {'week': 18, 'stage': 'Grain Filling', 'instruction': 'Reduce water level gradually to 2-3 cm. Apply foliar spray of potash (2%). Monitor for grain discoloration.', 'tips': 'Maintain soil moisture but avoid stagnant water.'},
                {'week': 20, 'stage': 'Maturity', 'instruction': 'Drain field 10-15 days before harvest. Monitor grain moisture content. Prepare for harvesting.', 'tips': 'Harvest when 80% grains turn golden yellow and moisture is 20-22%.'},
                {'week': 21, 'stage': 'Harvesting', 'instruction': 'Harvest early morning when dew is present. Cut 15-20 cm above ground. Bundle and dry in field for 2-3 days.', 'tips': 'Proper drying reduces grain breakage during milling.'}
            ],
            
            'Wheat': [
                {'week': 1, 'stage': 'Land Preparation', 'instruction': 'Deep plowing with moldboard plow. Cross harrowing 2-3 times. Level the field with leveler. Apply 15-20 tons FYM per hectare.', 'tips': 'Prepare fine seedbed for better germination and root development.'},
                {'week': 2, 'stage': 'Seed Treatment', 'instruction': 'Treat seeds with fungicide (2.5g/kg seed). Use certified seeds of recommended varieties. Check germination percentage.', 'tips': 'Seed rate: 100 kg/ha for timely sowing, 125 kg/ha for late sowing.'},
                {'week': 3, 'stage': 'Sowing', 'instruction': 'Sow at 2-3 cm depth with 20 cm row spacing. Apply basal fertilizer: 80 kg N, 40 kg P₂O₅, 40 kg K₂O per hectare.', 'tips': 'Optimal sowing time: November 15 - December 15 for most regions.'},
                {'week': 4, 'stage': 'Germination', 'instruction': 'Ensure adequate soil moisture for germination. Apply light irrigation if needed. Monitor for cutworm damage.', 'tips': 'Germination should complete within 7-10 days of sowing.'},
                {'week': 6, 'stage': 'Early Growth', 'instruction': 'Apply first irrigation 20-25 days after sowing. Remove weeds manually or use herbicide. Monitor plant population.', 'tips': 'Maintain 300-350 plants per square meter for optimal yield.'},
                {'week': 8, 'stage': 'Tillering', 'instruction': 'Apply first nitrogen top dressing (40 kg/ha) with second irrigation. Control broad leaf weeds if present.', 'tips': 'Maximum tillering occurs between 30-60 days after sowing.'},
                {'week': 10, 'stage': 'Crown Root Initiation', 'instruction': 'Apply third irrigation. Monitor for aphid infestation. Apply insecticide if aphid count exceeds 5 per tiller.', 'tips': 'Crown root initiation is critical for plant establishment.'},
                {'week': 12, 'stage': 'Jointing Stage', 'instruction': 'Apply second nitrogen dose (40 kg/ha) with fourth irrigation. Monitor for rust diseases. Apply fungicide if needed.', 'tips': 'Jointing stage determines number of grains per spike.'},
                {'week': 14, 'stage': 'Booting Stage', 'instruction': 'Apply fifth irrigation. Monitor for flag smut and loose smut. Remove infected plants immediately.', 'tips': 'Flag leaf emergence indicates booting stage completion.'},
                {'week': 16, 'stage': 'Flowering', 'instruction': 'Apply sixth irrigation during flowering. Avoid any stress during this period. Monitor for Karnal bunt.', 'tips': 'Flowering period is most critical for grain formation.'},
                {'week': 18, 'stage': 'Grain Filling', 'instruction': 'Apply seventh irrigation during grain filling. Monitor grain development. Apply foliar spray of urea (2%) if needed.', 'tips': 'Grain filling period determines grain weight and quality.'},
                {'week': 20, 'stage': 'Dough Stage', 'instruction': 'Stop irrigation. Monitor grain moisture content. Prepare harvesting equipment. Control birds if necessary.', 'tips': 'Grain moisture should be 35-40% at dough stage.'},
                {'week': 22, 'stage': 'Maturity', 'instruction': 'Harvest when grain moisture is 20-25%. Cut crop early morning. Bundle and dry in field.', 'tips': 'Delayed harvesting leads to grain shattering and quality loss.'}
            ],
            
            'Maize': [
                {'week': 1, 'stage': 'Land Preparation', 'instruction': 'Deep plowing followed by 2-3 harrowings. Prepare ridges and furrows. Apply 20-25 tons FYM per hectare.', 'tips': 'Good drainage is essential for maize cultivation.'},
                {'week': 2, 'stage': 'Seed Treatment & Sowing', 'instruction': 'Treat seeds with fungicide and insecticide. Sow at 3-4 cm depth with 60×20 cm spacing. Apply basal fertilizer.', 'tips': 'Use hybrid seeds for better yield. Seed rate: 20-25 kg/ha.'},
                {'week': 3, 'stage': 'Germination', 'instruction': 'Ensure adequate moisture for germination. Apply light irrigation if needed. Monitor for cutworm and wireworm.', 'tips': 'Germination should complete within 5-7 days.'},
                {'week': 4, 'stage': 'Early Vegetative', 'instruction': 'Thin plants to maintain proper spacing. Apply first irrigation. Remove weeds manually.', 'tips': 'Maintain one healthy plant per hill.'},
                {'week': 6, 'stage': 'Knee High Stage', 'instruction': 'Apply first nitrogen top dressing (60 kg/ha). Earth up around plants. Control stem borer with insecticide.', 'tips': 'Earthing up provides support and controls weeds.'},
                {'week': 8, 'stage': 'Rapid Growth', 'instruction': 'Apply second irrigation. Monitor for fall armyworm. Use pheromone traps for monitoring.', 'tips': 'Fall armyworm can cause severe damage if not controlled early.'},
                {'week': 10, 'stage': 'Pre-Tasseling', 'instruction': 'Apply second nitrogen dose (60 kg/ha). Ensure adequate moisture. Monitor for borer damage.', 'tips': 'Critical period for nitrogen uptake and growth.'},
                {'week': 12, 'stage': 'Tasseling', 'instruction': 'Apply irrigation during tasseling. Monitor pollen shed. Control corn borer if present.', 'tips': 'Water stress during tasseling severely affects yield.'},
                {'week': 14, 'stage': 'Silking', 'instruction': 'Maintain adequate soil moisture. Monitor silk emergence. Apply insecticide for corn earworm control.', 'tips': 'Synchronization of pollen shed and silk emergence is crucial.'},
                {'week': 16, 'stage': 'Grain Filling', 'instruction': 'Continue irrigation. Monitor grain development. Apply foliar spray of micronutrients if needed.', 'tips': 'Grain filling determines final grain weight.'},
                {'week': 18, 'stage': 'Dent Stage', 'instruction': 'Reduce irrigation frequency. Monitor grain moisture. Prepare for harvesting.', 'tips': 'Dent formation indicates physiological maturity.'},
                {'week': 20, 'stage': 'Maturity', 'instruction': 'Harvest when grain moisture is 15-20%. Dry cobs properly before shelling.', 'tips': 'Proper drying prevents fungal growth and maintains quality.'}
            ]
        }
        
        for crop_name, care_data in crops_care_data.items():
            try:
                crop = Crop.objects.get(name=crop_name)
                for guide_data in care_data:
                    CropCareGuide.objects.create(
                        crop=crop,
                        week_number=guide_data['week'],
                        stage=guide_data['stage'],
                        care_instruction=guide_data['instruction'],
                        tips=guide_data['tips']
                    )
                self.stdout.write(f'Added care guides for {crop_name}')
            except Crop.DoesNotExist:
                self.stdout.write(f'Crop {crop_name} not found')
        
        self.stdout.write(self.style.SUCCESS('Successfully populated comprehensive care guides'))