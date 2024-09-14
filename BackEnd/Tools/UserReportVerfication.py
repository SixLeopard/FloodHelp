import Tools.Proximity as proximity
import Tools.CoordString_to_Tuple as cordconv

acceptable_proximity = 0.02

def validate_user_reports(sample_reports : dict, base_report : dict) -> tuple[int, list]:
    '''
        gives the similarity score (validitity score)
        sample_reports:
            dict of reports
            the reports to check base report against fo rsimilirty
        base_report:
            dict of single report
            the reort you want to none the similiarity score of

        returns:
            the score and a list of all the reports it was similar too
    '''
    similarity_score = 0
    similar_reports = []
    for i in sample_reports:
        if proximity.is_close(cordconv.convert(base_report["coordinates"]), cordconv.convert(sample_reports[i]["coordinates"]), acceptable_proximity) and \
        base_report["reporting_user_id"] != sample_reports[i]["reporting_user_id"]:
            #base_report["type"] == sample_reports[i]["type"] and base_report["reporting_user_id"] != sample_reports[i]["reporting_user_id"]:
            similarity_score += 1
            similar_reports.append(i)
    return similarity_score, similar_reports