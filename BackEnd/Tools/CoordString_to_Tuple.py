
def convert(coord : str) -> tuple[float,float]:
    parts = coord.replace('"', "").replace(')', "").replace('(', "").replace('[', "").replace(']', "").split(",")
    output = (float(parts[0].replace("{", "").replace("}", "")), float(parts[1].replace("{", "").replace("}", "")))
    return output