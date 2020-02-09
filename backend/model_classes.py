from dataclasses import dataclass
from dataclasses_json import dataclass_json, LetterCase
from typing import List


# Return dataclass Definitions
@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class Skill:
    skill_name: str
    experience_level: int


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class Profile:
    profile_id: int
    webex_id: str
    webex_handle: str
    name: str
    image_url: str
    institution: str
    skills: List[Skill]
    age: str
    tokens: float


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class EnhancedProfile:
    brief: Profile
    description: str


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class DashboardView:
    profiles: List[Profile]


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class User:
    user_id: int
    first_name: str
    last_name: str
    date_of_birth: str
    institution: str
    description: str
    profile_pic: str
    webex_id: str


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class Subject:
    subject_id: int
    name: str
    description: str


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class Topic:
    topic_id: int
    name: str
    subject_id: int
    description: str


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class Friend:
    friendship_id: int
    user_id1: int
    user_id2: int
    status: str     # MAP FROM INT TO STRING


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class UserTopicMap:
    skill_id: int
    user_id: int
    topic_id: int
    expertise: str  # MAP FROM INT TO STRING
