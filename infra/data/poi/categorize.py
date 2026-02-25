import json

MAIN_CATEGORIES = [
    "food",
    "bar",
    "cafe",
    "club",
    "tourist_attraction",
    "entertainment",
    "shopping",
    "sports_outdoors",
    "accommodation",
    "health_wellness",
    "services",
    "unknown"
]

RULES = {
    "food": ["restaurant", "imbiss", "takeaway", "döner", "pizzeria", "steakhaus", "fast-food", "lebensmittel", "brasserie", "diner", "food", "deli", "butcher", "seafood", "pasta", "suppe", "taco", "tapas", "burger", "feinkost", "frühstück", "buffet", "kantine", "caterer", "catering", "gasthaus", "gasthof", "hot\xaddog", "cheese", "spices", "asian", "caribbean", "bbq"],
    "cafe": [ "cafe", "café", "coffee", "coffeehouse", "coffee house", "coffeeshop", "coffee shop", "kaffee", "kaffeehaus",
    "kaffeebar", "kaffeestube", "kaffeeladen",
    "bäckerei", "baeckerei", "bakery",
    "bistro", "konditorei", "patisserie", "confiserie",
    "confectionery", "chocolate", "tea", "teehaus",
    "kaffeeröster", "kaffeeroester", "roastery",
    "ice_cream", "eissalon", "eisdiele",
    "espresso", "espresso bar", "espressohouse",
    "brew bar", "brewery cafe", "brew café",
    "specialty coffee", "third wave coffee",
    "craft coffee", "artisan coffee",
    "filter coffee", "cold brew",
    "latte", "cappuccino", "flat white",
    "barista", "barista bar",
    "coffee lounge", "café lounge",
    "breakfast cafe", "brunch cafe",
    "frühstückscafé", "fruehstueckscafe",

    "backshop", "backhaus", "backstube",
    "brothaus", "brotmanufaktur", "brottheke",
    "brotdiele", "brotcafé", "kuchencafé",
    "kuchenladen", "tortenstudio",
    "cake shop", "cake studio",
    "pastry shop", "pastry cafe",
    "dessert cafe", "dessert bar",
    "cupcake shop", "donut shop",
    "bagel shop", "waffle house",
    "crêperie", "creperie", "pancake house",

    "gelato", "gelateria",
    "ice cream shop", "ice cream parlor",
    "frozen yogurt", "froyo",
    "milkshake bar", "smoothie bar",
    "juice bar", "acai bowl",
    "bubble tea", "boba", "tea bar",
    "matcha bar",

    "chocolatier", "schokoladenmanufaktur",
    "schokoladenladen", "pralinenmanufaktur",
    "candy shop", "sweet shop",
    "fudge shop", "trüffel", "trueffel",

    "deli", "delicatessen",
    "sandwich shop", "sandwich bar",
    "salad bar", "snack bar",
    "imbiss", "imbissstube",
    "lunch cafe",
    "stube", "gaststube",
    "wohncafé", "wohnzimmercafé",
    "kulturcafé", "literaturcafé",
    "buchcafé", "book cafe",
    "art cafe", "galerie cafe",
    "concept cafe", "coworking cafe",
    "cat cafe", "garten café",
    "hofcafé", "landcafé",
    "bergcafé", "seecafé",
    "strandcafé",
    "cafeteria", "cafetería",
    "salon de thé", "salon de the",
    "pasticceria", "panetteria",
    "panadería", "pastelería",
    "confitería", "bistrot",
    "brasserie",
    "kaffee", "caff", "cafe", "caf",
    "bean", "beans", "brew",
    "roast", "röst", "roest", "roesterei",
    "rösterei", "roastery",
    "mokka", "mocha",
    "latte", "crema",
    "aroma", "bohne", "bohnen",
    "koffein", "caffeine",
    "kuch", "kuchen", "torte",
    "brot", "back", "baeck",
    "süss", "suess", "sweet",
    "choco", "schoko",
    "milch", "milk",
    "tea", "tee", "chai",
    "haus", "stube", "lounge",
    "bar", "barista",
    "genuss", "manufaktur",
    "werkstatt", "atelier",
    "diele", "theke"],
    "bar": ["bar", "pub", "biergarten", "kneipe", "brauerei", "brauhaus", "heuriger", "weingut", "weinhandlung", "shisha", "lounge", "wine", "alcohol", "beverages"],
    "club": ["club", "diskothek", "nachtclub", "strip", "brothel", "swingerclub", "bordell", "tanzlokal", "saunaclub", "rockmusikklub"],
    "tourist_attraction": ["museum", "attraction", "gallery", "monument", "zoo", "aquarium", "viewpoint", "historisch", "sehenswürdigkeit", "schloss", "freilicht", "denkmal", "denk\xadmal", "touristeninformation", "galerie", "ausstellung", "observatorium", "aussicht", "andachts", "kirche", "moschee", "dom", "kapelle", "geheiligte stätte", "skulptur", "kultur", "kunst", "fountain", "picnic_site", "brücke", "denk", "landschaft", "schutzgebiet"],
    "entertainment": ["cinema", "theatre", "casino", "gambling", "music_venue", "amusement", "escape", "stage", "theater", "kینو", "spielhalle", "konzert", "bühne", "freizeitpark", "spielkasino", "billard", "bowling", "comedy", "oper", "riesenrad", "philharmonie", "veranstaltungsraum", "veranstaltungsstätte", "arts_centre", "community_centre", "social_centre", "conference_centre", "events_venue", "exhibition_centre", "planetarium", "studio", "adult_gaming_centre", "bandstand", "bookmaker", "lottery", "entertainer", "künstler", "videothek", "art"],
    "shopping": ["shopping", "mall", "clothes", "shoes", "electronics", "supermarket", "geschäft", "markt", "händler", "boutique", "laden", "shop", "einkauf", "drogerie", "mode", "buchhandlung", "einzelhandel", "supermarkt", "verbrauchermarkt", "autohaus", "bäderstudio", "marketplace", "convenience", "wholesale", "greengrocer", "farm", "department_store", "outdoor", "gift", "variety_store", "jewelry", "books", "music", "video_games", "mobile_phone", "toy", "hobby", "games", "craft", "second_hand", "organic", "general", "cosmetics", "beauty", "baustoff", "landwirtschaft", "fachhandel", "klempner", "türfachhandel"],
    "sports_outdoors": ["sport", "fitness", "swimming", "stadium", "pitch", "sportanlage", "verein", "stadion", "park", "garden", "nature_reserve", "garten", "wald", "kletter", "tennis", "golf", "spielplatz", "squash", "ice_rink", "track", "marina", "common", "stadtwäldchen", "playground", "wander"],
    "accommodation": ["hotel", "hostel", "guest_house", "camp_site", "ferienwohnung", "pension", "unterkunft", "apartment", "camping", "wohnanlage", "caravan_site", "studentenwohnheim"],
    "health_wellness": ["health", "spa", "sauna", "doctor", "arzt", "apotheke", "klinik", "medizin", "pflege", "massage", "therapeut", "kosmetik", "optiker", "chirurg", "friseur", "ärzte"],
    "services": ["service", "bank", "post", "schule", "universität", "bibliothek", "behörde", "werkstatt", "installateur", "reparatur", "makler", "agentur", "reinigung", "transport", "tankstelle", "bahnhof", "haltestelle", "berater", "zentrum", "unternehmen", "dienst", "anbieter", "architekt", "restaurierung", "installationsbetrieb", "handwerk", "monteur", "bildung", "botschaft", "buchbinderei", "call center", "co-working", "energie", "eventmanagement", "firma", "fotovoltaik", "friedhof", "gemeinnützig", "unternehmer", "gewächshaus", "hersteller", "invest", "labor", "lager", "magistrat", "mistplatz", "regierungs", "pfand", "reisebüro", "technik", "sanität", "schneider", "senioren", "sozial", "verwaltung", "stiftung", "planer", "verbrennung", "bücherei", "schaden", "bauprojekt", "betreutes", "fliesen", "rundfahrt", "zeitung", "bauprojekt", "betreutes", "fliesen", "rundfahrt", "zeitung"]
}

def map_category(cat: str) -> str:
    cat_lower = cat.lower()
    for main_cat, keywords in RULES.items():
        if any(kw in cat_lower for kw in keywords):
            return main_cat
    return "unknown"

def main():
    google_mapping = {}
    
    # Process Google categories
    # Note: Using absolute paths referring to where these files probably are now, based on you moving things to poi directory.
    # We will just write the files relative to the current directory for ease.
    with open('all_google_categories.txt', 'r', encoding='utf-8') as f:
        lines = f.read().splitlines()
        for line in lines:
            line = line.strip()
            if not line:
                continue
            cat = map_category(line)
            google_mapping[line] = cat
                
    # Process OSM categories
    osm_mapping = {}
    with open('osm_categories.csv', 'r', encoding='utf-8') as f:
        content = f.read().replace('\n', ',')
        parts = [p.strip() for p in content.split(',') if p.strip() and p.strip() != '*']
        for p in parts:
            if '=' in p:
                continue # e.g. restaurant+takeaway=yes
            cat = map_category(p)
            osm_mapping[p] = cat
                
    with open('google_category_mapping.json', 'w', encoding='utf-8') as f:
        json.dump(google_mapping, f, ensure_ascii=False, indent=2)

    with open('osm_category_mapping.json', 'w', encoding='utf-8') as f:
        json.dump(osm_mapping, f, ensure_ascii=False, indent=2)

    with open('main_categories.json', 'w', encoding='utf-8') as f:
        json.dump(MAIN_CATEGORIES, f, ensure_ascii=False, indent=2)
        
    print(f"Total Google mapped: {len(google_mapping)}")
    print(f"Total OSM mapped: {len(osm_mapping)}")
    print(f"Main categories ({len(MAIN_CATEGORIES)}): {MAIN_CATEGORIES}")

if __name__ == '__main__':
    main()
