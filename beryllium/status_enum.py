from enum import StrEnum, auto

class autostr(str, auto):
    pass

class AutoName(StrEnum):
    @staticmethod
    def _generate_next_value_(name, *_):
        return name

class RunningStatus(AutoName):
    STARTED = autostr()
    PARTIAL = autostr()

class NotRunningStatus(AutoName):
    NEW = autostr()
    TERMINATED = autostr()
    STOPPED = autostr()
