import Tools.Proximity as proximity

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
        if proximity.is_close(base_report["location"], sample_reports[i]["location"], acceptable_proximity) and \
            base_report["type"] == sample_reports[i]["type"] and base_report["User"] != sample_reports[i]["User"]:
            similarity_score += 1
            similar_reports.append(i)
    return similarity_score, similar_reports