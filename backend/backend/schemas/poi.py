# class CategoryEnum(str, Enum):
#     FOOD = "food"
#     BAR = "bar"
#     CAFE = "cafe"
#     CLUB = "club"
#     TOURIST_ATTRACTION = "tourist_attraction"
#     ENTERTAINMENT = "entertainment"
#     SHOPPING = "shopping"
#     SPORTS_OUTDOORS = "sports_outdoors"
#     ACCOMMODATION = "accommodation"
#     HEALTH_WELLNESS = "health_wellness"
#     SERVICES = "services"
#     UNKNOWN = "unknown"

# class CategorySelection(BaseModel):
#     category: list[CategoryEnum]

# class GooglePOI(BaseModel):
#     name: str
#     address: str
#     latitude: float
#     longitude: float
#     category: CategoryEnum

# class OSMPOI(BaseModel):
#     name: str
#     address: str
#     latitude: float
#     longitude: float
#     category: CategoryEnum