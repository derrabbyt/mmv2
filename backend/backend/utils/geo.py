"""
GeoJSON utilities.
"""

from geoalchemy2.shape import to_shape
from shapely.geometry import shape, mapping


def wkb_to_geojson(wkb_data) -> dict:
    """
    Converts GeoAlchemy2 WKBElement or WKB into a GeoJSON dict.
    """
    if wkb_data is None:
        return None
    shapely_geom = to_shape(wkb_data)
    return mapping(shapely_geom)


def geojson_to_wkt(geojson_dict: dict) -> str:
    """
    Converts a GeoJSON dict directly into a WKT string.
    """
    if geojson_dict is None:
        return None
    shapely_geom = shape(geojson_dict)
    return shapely_geom.wkt
