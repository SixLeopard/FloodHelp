
def convert(coord : str) -> tuple[float,float]:
    parts = coord.replace('"', "").replace(')', "").replace('(', "").split(",")
    output = (float(parts[0]), float(parts[1]))
    return output