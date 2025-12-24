import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Define Location schema directly
const locationSchema = new mongoose.Schema({
  state: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  blocks: [{ type: String, trim: true }]
}, {
  timestamps: true,
  collection: 'locations'
});

locationSchema.index({ state: 1, district: 1 });

// Comprehensive locations data for all Indian states
const locationsData = [
  // Tamil Nadu
  { state: "Tamil Nadu", district: "Chennai", blocks: ["Alandur", "Ambattur", "Anna Nagar", "Egmore", "Mambalam", "Mylapore", "Perambur", "Teynampet", "Tondiarpet", "Velachery"] },
  { state: "Tamil Nadu", district: "Tiruvallur", blocks: ["Avadi", "Gummidipoondi", "Pallipattu", "Ponneri", "Poonamallee", "R.K. Pet", "Tiruttani", "Uthukottai"] },
  { state: "Tamil Nadu", district: "Kanchipuram", blocks: ["Alandur", "Cheyyur", "Kanchipuram", "Kundrathur", "Pallavaram", "Sriperumbudur", "Tambaram", "Uthiramerur"] },
  { state: "Tamil Nadu", district: "Vellore", blocks: ["Ambur", "Gudiyatham", "Katpadi", "Tirupattur", "Vaniyambadi", "Vellore"] },
  { state: "Tamil Nadu", district: "Coimbatore", blocks: ["Coimbatore North", "Coimbatore South", "Madukkarai", "Mettupalayam", "Pollachi", "Sulur", "Udumalpet", "Valparai"] },
  { state: "Tamil Nadu", district: "Madurai", blocks: ["Kallikudi", "Madurai East", "Madurai North", "Madurai South", "Madurai West", "Melur", "Peraiyur", "Thirumangalam", "Usilampatti", "Vadipatti"] },
  { state: "Tamil Nadu", district: "Tiruchirappalli", blocks: ["Lalgudi", "Manachanallur", "Manapparai", "Marungapuri", "Musiri", "Thottiyam", "Thuraiyur", "Tiruchirappalli"] },
  { state: "Tamil Nadu", district: "Salem", blocks: ["Attur", "Edappadi", "Gangavalli", "Kadayampatti", "Omalur", "Pethanaickenpalayam", "Salem", "Sankagiri", "Vazhapadi", "Yercaud"] },
  { state: "Tamil Nadu", district: "Erode", blocks: ["Anthiyur", "Bhavani", "Erode", "Gobichettipalayam", "Kodumudi", "Modakurichi", "Perundurai", "Sathyamangalam", "Thalavadi"] },
  { state: "Tamil Nadu", district: "Tirunelveli", blocks: ["Ambasamudram", "Cheranmahadevi", "Manur", "Nanguneri", "Palayamkottai", "Radhapuram", "Sankarankoil", "Tirunelveli", "Valliyur"] },
  
  // Karnataka
  { state: "Karnataka", district: "Bangalore Urban", blocks: ["Anekal", "Bangalore East", "Bangalore North", "Bangalore South", "Bangalore West", "Bommanahalli"] },
  { state: "Karnataka", district: "Bangalore Rural", blocks: ["Devanahalli", "Doddaballapura", "Hosakote", "Nelamangala"] },
  { state: "Karnataka", district: "Mysore", blocks: ["Hunsur", "K.R. Nagar", "Mysore", "Periyapatna", "T. Narasipura"] },
  { state: "Karnataka", district: "Mangalore", blocks: ["Bantwal", "Belthangady", "Mangalore", "Moodabidri", "Puttur", "Sullia"] },
  { state: "Karnataka", district: "Hubli-Dharwad", blocks: ["Dharwad", "Hubli", "Kalghatgi", "Kundgol", "Navalgund"] },
  { state: "Karnataka", district: "Belgaum", blocks: ["Bailhongal", "Belgaum", "Chikodi", "Gokak", "Khanapur", "Ramdurg", "Saundatti"] },
  { state: "Karnataka", district: "Gulbarga", blocks: ["Afzalpur", "Aland", "Chincholi", "Chitapur", "Gulbarga", "Jevargi", "Sedam"] },
  { state: "Karnataka", district: "Shimoga", blocks: ["Bhadravati", "Hosanagar", "Sagar", "Shimoga", "Shikaripura", "Sorab", "Thirthahalli"] },
  
  // Maharashtra
  { state: "Maharashtra", district: "Mumbai", blocks: ["Andheri", "Borivali", "Byculla", "Dadar", "Kurla", "Malad", "Mumbai Central", "Vile Parle", "Worli"] },
  { state: "Maharashtra", district: "Pune", blocks: ["Ambegaon", "Baramati", "Bhor", "Daund", "Haveli", "Indapur", "Junnar", "Maval", "Mulshi", "Pune City", "Purandhar", "Shirur", "Velhe"] },
  { state: "Maharashtra", district: "Nagpur", blocks: ["Hingna", "Kamptee", "Katol", "Kuhi", "Nagpur Rural", "Nagpur Urban", "Narkhed", "Parseoni", "Ramtek", "Savner", "Umred"] },
  { state: "Maharashtra", district: "Thane", blocks: ["Ambernath", "Bhiwandi", "Kalyan", "Murbad", "Shahapur", "Thane", "Ulhasnagar"] },
  { state: "Maharashtra", district: "Nashik", blocks: ["Baglan", "Chandwad", "Deola", "Dindori", "Igatpuri", "Kalwan", "Malegaon", "Nashik", "Niphad", "Peint", "Sinnar", "Surgana", "Trimbakeshwar", "Yeola"] },
  { state: "Maharashtra", district: "Aurangabad", blocks: ["Aurangabad", "Gangapur", "Kannad", "Khuldabad", "Paithan", "Phulambri", "Sillod", "Soegaon", "Vaijapur"] },
  { state: "Maharashtra", district: "Solapur", blocks: ["Akkalkot", "Barshi", "Karmala", "Madha", "Malshiras", "Mangalvedhe", "Mohol", "Pandharpur", "Sangole", "Solapur North", "Solapur South"] },
  { state: "Maharashtra", district: "Kolhapur", blocks: ["Bhudargad", "Chandgad", "Gadhinglaj", "Hatkanangle", "Kagal", "Karvir", "Panhala", "Radhanagari", "Shahuwadi", "Shirol"] },
  
  // Delhi
  { state: "Delhi", district: "Central Delhi", blocks: ["Chandni Chowk", "Civil Lines", "Darya Ganj", "Karol Bagh", "Kotwali"] },
  { state: "Delhi", district: "North Delhi", blocks: ["Alipur", "Model Town", "Narela", "Rohini", "Sadar Bazar"] },
  { state: "Delhi", district: "South Delhi", blocks: ["Defence Colony", "Hauz Khas", "Kalkaji", "Mehrauli", "Saket"] },
  { state: "Delhi", district: "East Delhi", blocks: ["Gandhi Nagar", "Mayur Vihar", "Preet Vihar", "Shahdara", "Vivek Vihar"] },
  { state: "Delhi", district: "West Delhi", blocks: ["Janakpuri", "Najafgarh", "Patel Nagar", "Punjabi Bagh", "Rajouri Garden"] },
  
  // Gujarat
  { state: "Gujarat", district: "Ahmedabad", blocks: ["Ahmedabad City", "Daskroi", "Dhandhuka", "Dholka", "Mandal", "Sanand", "Viramgam"] },
  { state: "Gujarat", district: "Surat", blocks: ["Bardoli", "Chorasi", "Kamrej", "Mahuva", "Mangrol", "Olpad", "Palsana", "Surat City", "Umarpada"] },
  { state: "Gujarat", district: "Vadodara", blocks: ["Dabhoi", "Karjan", "Padra", "Savli", "Shinor", "Vadodara City", "Waghodia"] },
  { state: "Gujarat", district: "Rajkot", blocks: ["Gondal", "Jasdan", "Kotda Sangani", "Lodhika", "Paddhari", "Rajkot", "Upleta", "Vinchhiya"] },
  { state: "Gujarat", district: "Bhavnagar", blocks: ["Bhavnagar", "Gariadhar", "Mahuva", "Palitana", "Sihor", "Talaja", "Umrala", "Vallabhipur"] },
  { state: "Gujarat", district: "Jamnagar", blocks: ["Dhrol", "Jamnagar", "Jamjodhpur", "Jodiya", "Kalavad", "Khambhalia", "Lalpur"] },
  
  // Rajasthan
  { state: "Rajasthan", district: "Jaipur", blocks: ["Amber", "Bassi", "Chaksu", "Chomu", "Jaipur", "Jamwa Ramgarh", "Kotputli", "Phagi", "Phulera", "Sambhar", "Shahpura", "Viratnagar"] },
  { state: "Rajasthan", district: "Jodhpur", blocks: ["Balesar", "Bhopalgarh", "Bilara", "Jodhpur", "Luni", "Osian", "Phalodi", "Shergarh"] },
  { state: "Rajasthan", district: "Udaipur", blocks: ["Bhinder", "Gogunda", "Jhadol", "Kherwara", "Kotra", "Mavli", "Salumbar", "Sarada", "Udaipur"] },
  { state: "Rajasthan", district: "Kota", blocks: ["Digod", "Itawa", "Kanwas", "Kota", "Ladpura", "Pipalda", "Sangod", "Sultanpur"] },
  { state: "Rajasthan", district: "Ajmer", blocks: ["Ajmer", "Arai", "Beawar", "Kekri", "Kishangarh", "Masuda", "Nasirabad", "Pisangan"] },
  { state: "Rajasthan", district: "Bikaner", blocks: ["Bikaner", "Chhatargarh", "Dungargarh", "Khajuwala", "Kolayat", "Lunkaransar", "Nokha", "Poogal"] },
  
  // Uttar Pradesh
  { state: "Uttar Pradesh", district: "Lucknow", blocks: ["Bakshi Ka Talab", "Chinhat", "Lucknow", "Mal", "Malihabad", "Mohanlalganj", "Sarojaninagar"] },
  { state: "Uttar Pradesh", district: "Kanpur Nagar", blocks: ["Bilhaur", "Ghatampur", "Kanpur", "Maitha", "Sarsaul", "Vidhnu"] },
  { state: "Uttar Pradesh", district: "Agra", blocks: ["Agra", "Bah", "Barauli Ahir", "Etmadpur", "Fatehabad", "Fatehpur Sikri", "Kheragarh", "Kiraoli"] },
  { state: "Uttar Pradesh", district: "Varanasi", blocks: ["Araziline", "Baragaon", "Cholapur", "Harahua", "Kashi Vidyapith", "Pindra", "Sewapuri", "Varanasi"] },
  { state: "Uttar Pradesh", district: "Ghaziabad", blocks: ["Bhojpur", "Dadri", "Dhaulana", "Ghaziabad", "Hapur", "Loni", "Muradnagar", "Pilkhuwa"] },
  { state: "Uttar Pradesh", district: "Noida", blocks: ["Dadri", "Dankaur", "Jewar", "Noida"] },
  { state: "Uttar Pradesh", district: "Allahabad", blocks: ["Allahabad", "Bara", "Handia", "Karchhana", "Koraon", "Meja", "Phulpur", "Shankargarh", "Soraon"] },
  { state: "Uttar Pradesh", district: "Meerut", blocks: ["Daurala", "Hastinapur", "Machhra", "Mawana", "Meerut", "Parikshitgarh", "Sardhana", "Sarurpur"] },
  
  // West Bengal
  { state: "West Bengal", district: "Kolkata", blocks: ["Beleghata", "Behala", "Chetla", "Garden Reach", "Jadavpur", "Kalighat", "Kolkata", "Metiabruz", "Tollygunge"] },
  { state: "West Bengal", district: "North 24 Parganas", blocks: ["Barasat", "Basirhat", "Deganga", "Habra", "Haroa", "Rajarhat"] },
  { state: "West Bengal", district: "South 24 Parganas", blocks: ["Baruipur", "Canning", "Diamond Harbour", "Falta", "Jaynagar", "Kakdwip", "Sonarpur"] },
  { state: "West Bengal", district: "Howrah", blocks: ["Amta", "Bagnan", "Bally", "Domjur", "Howrah", "Jagatballavpur", "Shyampur", "Udaynarayanpur"] },
  { state: "West Bengal", district: "Darjeeling", blocks: ["Darjeeling", "Gorubathan", "Jorebunglow", "Kalimpong", "Kurseong", "Mirik", "Rangli Rangliot"] },
  { state: "West Bengal", district: "Jalpaiguri", blocks: ["Alipurduar", "Dhupguri", "Jalpaiguri", "Mal", "Maynaguri", "Nagrakata", "Rajganj"] },
  
  // Haryana
  { state: "Haryana", district: "Gurgaon", blocks: ["Farukhnagar", "Gurgaon", "Manesar", "Pataudi", "Sohna"] },
  { state: "Haryana", district: "Faridabad", blocks: ["Ballabgarh", "Faridabad", "Palwal", "Prithla"] },
  { state: "Haryana", district: "Rohtak", blocks: ["Kalanaur", "Meham", "Rohtak", "Sampla"] },
  { state: "Haryana", district: "Hisar", blocks: ["Adampur", "Agroha", "Barwala", "Hansi", "Hisar", "Narnaund", "Uklana"] },
  { state: "Haryana", district: "Panipat", blocks: ["Bapoli", "Israna", "Madlauda", "Panipat", "Samalkha"] },
  { state: "Haryana", district: "Karnal", blocks: ["Assandh", "Gharaunda", "Indri", "Karnal", "Nilokheri", "Nissing"] },
  
  // Madhya Pradesh
  { state: "Madhya Pradesh", district: "Indore", blocks: ["Depalpur", "Indore", "Mhow", "Sanwer"] },
  { state: "Madhya Pradesh", district: "Bhopal", blocks: ["Berasia", "Bhopal", "Huzur"] },
  { state: "Madhya Pradesh", district: "Jabalpur", blocks: ["Jabalpur", "Kundam", "Majholi", "Patan", "Shahpura", "Sihora"] },
  { state: "Madhya Pradesh", district: "Gwalior", blocks: ["Bhitarwar", "Dabra", "Ghatigaon", "Gwalior", "Morar"] },
  { state: "Madhya Pradesh", district: "Ujjain", blocks: ["Badnagar", "Mahidpur", "Tarana", "Ujjain"] },
  { state: "Madhya Pradesh", district: "Sagar", blocks: ["Banda", "Bina", "Khurai", "Malthone", "Rehli", "Sagar", "Shahgarh"] },
  
  // Telangana
  { state: "Telangana", district: "Hyderabad", blocks: ["Amberpet", "Charminar", "Golconda", "Khairatabad", "Musheerabad", "Secunderabad"] },
  { state: "Telangana", district: "Rangareddy", blocks: ["Ibrahimpatnam", "Kandukur", "Maheshwaram", "Rajendranagar", "Serilingampally", "Shamshabad", "Vikarabad"] },
  { state: "Telangana", district: "Warangal", blocks: ["Atmakur", "Geesugonda", "Hanamkonda", "Jangaon", "Parkal", "Raghunathpalle", "Warangal"] },
  { state: "Telangana", district: "Khammam", blocks: ["Burgampahad", "Khammam", "Kothagudem", "Madhira", "Palleru", "Penuballi", "Sathupalli", "Wyra"] },
  { state: "Telangana", district: "Karimnagar", blocks: ["Choppadandi", "Dharmapuri", "Huzurabad", "Karimnagar", "Manakondur", "Sultanabad"] },
  
  // Andhra Pradesh
  { state: "Andhra Pradesh", district: "Visakhapatnam", blocks: ["Anandapuram", "Araku Valley", "Bheemunipatnam", "Paderu", "Visakhapatnam"] },
  { state: "Andhra Pradesh", district: "Vijayawada", blocks: ["Gannavaram", "Jaggaiahpet", "Kanchikacherla", "Tiruvuru", "Vijayawada", "Vuyyuru"] },
  { state: "Andhra Pradesh", district: "Guntur", blocks: ["Bapatla", "Guntur", "Macherla", "Narasaraopet", "Ponnur", "Sattenapalle", "Tenali", "Vinukonda"] },
  { state: "Andhra Pradesh", district: "Nellore", blocks: ["Atmakur", "Gudur", "Kavali", "Nellore", "Sullurpeta", "Udayagiri", "Venkatagiri"] },
  { state: "Andhra Pradesh", district: "Kurnool", blocks: ["Adoni", "Allagadda", "Dhone", "Kurnool", "Nandyal", "Nandikotkur", "Pattikonda", "Yemmiganur"] },
  { state: "Andhra Pradesh", district: "Tirupati", blocks: ["Chandragiri", "Srikalahasti", "Tirupati", "Venkatagiri"] },
  
  // Kerala
  { state: "Kerala", district: "Thiruvananthapuram", blocks: ["Chirayinkeezhu", "Nedumangad", "Neyyattinkara", "Thiruvananthapuram", "Varkala"] },
  { state: "Kerala", district: "Kochi", blocks: ["Aluva", "Kochi", "Kunnathunad", "Muvattupuzha", "Paravur"] },
  { state: "Kerala", district: "Kozhikode", blocks: ["Balussery", "Koduvally", "Kozhikode", "Kunnamangalam", "Melady", "Panthalayani", "Thamarassery", "Vatakara"] },
  { state: "Kerala", district: "Kollam", blocks: ["Karunagappally", "Kollam", "Kottarakkara", "Kunnathur", "Pathanapuram", "Sasthamcotta"] },
  { state: "Kerala", district: "Thrissur", blocks: ["Chavakkad", "Irinjalakuda", "Kodungallur", "Kunnamkulam", "Mukundapuram", "Thalappilly", "Thrissur"] },
  { state: "Kerala", district: "Kannur", blocks: ["Iritty", "Kannur", "Payyannur", "Taliparamba", "Thalassery"] },
  
  // Punjab
  { state: "Punjab", district: "Ludhiana", blocks: ["Jagraon", "Khanna", "Ludhiana East", "Ludhiana West", "Payal", "Raikot", "Samrala"] },
  { state: "Punjab", district: "Amritsar", blocks: ["Ajnala", "Amritsar East", "Amritsar West", "Attari", "Jandiala Guru", "Majitha", "Tarn Taran"] },
  { state: "Punjab", district: "Jalandhar", blocks: ["Adampur", "Bhogpur", "Jalandhar East", "Jalandhar West", "Nakodar", "Phillaur", "Shahkot"] },
  { state: "Punjab", district: "Patiala", blocks: ["Nabha", "Patiala", "Patran", "Rajpura", "Samana"] },
  { state: "Punjab", district: "Bathinda", blocks: ["Bathinda", "Maur", "Nathana", "Rampura Phul", "Talwandi Sabo"] },
  
  // Odisha
  { state: "Odisha", district: "Bhubaneswar", blocks: ["Balianta", "Balipatna", "Bhubaneswar", "Jatani", "Khordha"] },
  { state: "Odisha", district: "Cuttack", blocks: ["Athagad", "Banki", "Baramba", "Cuttack", "Niali", "Salipur", "Tigiria"] },
  { state: "Odisha", district: "Puri", blocks: ["Brahmagiri", "Nimapara", "Puri", "Satyabadi"] },
  { state: "Odisha", district: "Ganjam", blocks: ["Aska", "Berhampur", "Chhatrapur", "Hinjilicut", "Khallikote"] },
  { state: "Odisha", district: "Sambalpur", blocks: ["Bamra", "Jujomura", "Kuchinda", "Naktideul", "Rairakhol", "Sambalpur"] },
  
  // Jharkhand
  { state: "Jharkhand", district: "Ranchi", blocks: ["Angara", "Bundu", "Chanho", "Kanke", "Mandar", "Namkum", "Ormanjhi", "Ranchi", "Silli", "Sonahatu"] },
  { state: "Jharkhand", district: "Jamshedpur", blocks: ["Boram", "Ghatshila", "Jamshedpur", "Musabani", "Potka"] },
  { state: "Jharkhand", district: "Dhanbad", blocks: ["Baghmara", "Baliapur", "Dhanbad", "Govindpur", "Nirsa", "Tundi"] },
  { state: "Jharkhand", district: "Bokaro", blocks: ["Bokaro", "Chas", "Chandrapura", "Gomia", "Peterbar"] },
  
  // Chhattisgarh
  { state: "Chhattisgarh", district: "Raipur", blocks: ["Abhanpur", "Arang", "Baloda Bazar", "Bhatapara", "Dharsiwa", "Raipur", "Tilda"] },
  { state: "Chhattisgarh", district: "Bilaspur", blocks: ["Belha", "Bilaspur", "Gaurela", "Masturi", "Mungeli", "Ratanpur"] },
  { state: "Chhattisgarh", district: "Durg", blocks: ["Balod", "Dhamdha", "Durg", "Patan"] },
  { state: "Chhattisgarh", district: "Bhilai", blocks: ["Bhilai", "Charoda", "Dhamdha"] },
  
  // Assam
  { state: "Assam", district: "Guwahati", blocks: ["Boko", "Chaygaon", "Guwahati", "Hajo", "Palashbari", "Rangia"] },
  { state: "Assam", district: "Dibrugarh", blocks: ["Barbarua", "Chabua", "Dibrugarh", "Khowang", "Moran", "Naharkatia", "Tingkhong"] },
  { state: "Assam", district: "Jorhat", blocks: ["Jorhat", "Majuli", "Mariani", "Teok", "Titabor"] },
  { state: "Assam", district: "Silchar", blocks: ["Cachar", "Dholai", "Lakhipur", "Silchar", "Sonai"] },
  
  // Bihar
  { state: "Bihar", district: "Patna", blocks: ["Bakhtiarpur", "Barh", "Danapur", "Fatuha", "Maner", "Masaurhi", "Naubatpur", "Patna", "Phulwari", "Sampatchak"] },
  { state: "Bihar", district: "Gaya", blocks: ["Atri", "Barachatti", "Belaganj", "Bodh Gaya", "Dobhi", "Fatehpur", "Gaya", "Khizarsarai", "Manpur", "Sherghati", "Tikari"] },
  { state: "Bihar", district: "Bhagalpur", blocks: ["Bhagalpur", "Kahalgaon", "Naugachhia", "Pirpainti", "Sabour", "Sultanganj"] },
  { state: "Bihar", district: "Muzaffarpur", blocks: ["Aurai", "Bochaha", "Gaighat", "Kanti", "Motipur", "Muzaffarpur", "Sahebganj", "Saraiya"] },
  
  // Uttarakhand
  { state: "Uttarakhand", district: "Dehradun", blocks: ["Chakrata", "Dehradun", "Doiwala", "Kalsi", "Raipur", "Rishikesh", "Tyuni", "Vikasnagar"] },
  { state: "Uttarakhand", district: "Haridwar", blocks: ["Bahadrabad", "Bhagwanpur", "Haridwar", "Laksar", "Narsan", "Roorkee"] },
  { state: "Uttarakhand", district: "Nainital", blocks: ["Betalghat", "Bhimtal", "Dhari", "Haldwani", "Kosyakutauli", "Nainital", "Ramgarh"] },
  { state: "Uttarakhand", district: "Rudrapur", blocks: ["Gadarpur", "Jaspur", "Kashipur", "Kichha", "Rudrapur", "Sitarganj"] },
  
  // Himachal Pradesh
  { state: "Himachal Pradesh", district: "Shimla", blocks: ["Chopal", "Chirgaon", "Junga", "Mashobra", "Rampur", "Rohru", "Shimla", "Theog"] },
  { state: "Himachal Pradesh", district: "Kangra", blocks: ["Dehra", "Dharamshala", "Indora", "Kangra", "Nurpur", "Palampur"] },
  { state: "Himachal Pradesh", district: "Mandi", blocks: ["Balh", "Karsog", "Mandi", "Padhar", "Sundernagar", "Thunag"] },
  { state: "Himachal Pradesh", district: "Kullu", blocks: ["Anni", "Banjar", "Bhuntar", "Kullu", "Manali", "Nirmand"] },
  
  // Jammu and Kashmir
  { state: "Jammu and Kashmir", district: "Srinagar", blocks: ["Aloosa", "Budgam", "Central Shalteng", "Hazratbal", "Khanyar", "Pantha Chowk"] },
  { state: "Jammu and Kashmir", district: "Jammu", blocks: ["Akhnoor", "Arnia", "Bishnah", "Jammu", "R.S. Pura", "Samba", "Suchetgarh"] },
  { state: "Jammu and Kashmir", district: "Anantnag", blocks: ["Anantnag", "Bijbehara", "Dooru", "Kokernag", "Pahalgam", "Shangus"] },
  
  // Goa
  { state: "Goa", district: "North Goa", blocks: ["Bardez", "Bicholim", "Pernem", "Ponda", "Sattari", "Tiswadi"] },
  { state: "Goa", district: "South Goa", blocks: ["Canacona", "Dharbandora", "Mormugao", "Quepem", "Salcete", "Sanguem"] }
];

async function populateLocations() {
  try {
    console.log('📡 Connecting to MongoDB...');
    console.log('URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'activ-db'
    });

    console.log('✅ Connected to MongoDB');
    console.log('📂 Database:', mongoose.connection.name);

    const Location = mongoose.model('Location', locationSchema);

    // Clear existing locations
    console.log('🗑️  Clearing existing locations...');
    await Location.deleteMany({});
    console.log('✅ Cleared existing locations');

    // Insert new locations
    console.log('📥 Inserting location data...');
    const result = await Location.insertMany(locationsData);
    console.log(`✅ Successfully inserted ${result.length} locations`);

    // Verify the data
    console.log('\n📊 Verification:');
    const allLocations = await Location.find({}).select('state district blocks');
    
    for (const loc of allLocations) {
      console.log(`   ${loc.state} -> ${loc.district}: ${loc.blocks.length} blocks`);
    }

    console.log('\n✅ Location population completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating locations:', error);
    process.exit(1);
  }
}

populateLocations();
