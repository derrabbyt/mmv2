from enum import Enum

class CategoryEnum(str, Enum):
    FOOD = "food"
    BAR = "bar"
    CAFE = "cafe"
    CLUB = "club"
    TOURIST_ATTRACTION = "tourist_attraction"
    ENTERTAINMENT = "entertainment"
    SHOPPING = "shopping"
    SPORTS_OUTDOORS = "sports_outdoors"
    ACCOMMODATION = "accommodation"
    HEALTH_WELLNESS = "health_wellness"
    SERVICES = "services"
    UNKNOWN = "unknown"


class MeetupStatusEnum(str, Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    CANCELLED = "cancelled"
