from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, TIMESTAMP, BLOB
from database import Base

class Photo(Base):
    __tablename__ = "photos"

    PhotoID = Column(Integer, primary_key=True)
    file_name = Column(String(50))
    file_path = Column(String(50))
    UploadTime = Column(TIMESTAMP)

class User(Base):
    __tablename__ = "users"

    UserID = Column(Integer, primary_key=True)
    FirstName = Column(String(50))
    LastName = Column(String(50))
    Email = Column(String(100))
    Age = Column(Integer)
    Gender = Column(String(20))
    Location = Column(String(100))

class Profile(Base):
    __tablename__ = "profiles"

    ProfileID = Column(Integer, primary_key=True)
    UserID = Column(Integer, ForeignKey('users.UserID'), nullable=False)
    PhotoID = Column(Integer, default=0)
    Bio = Column(String(500))
    
class Swipe(Base):
    __tablename__ = "swipes"

    SwipeID = Column(Integer, primary_key=True)
    UserID = Column(Integer, ForeignKey('users.UserID'), nullable=False)
    ProfileID = Column(Integer, ForeignKey('profiles.ProfileID'), nullable=False)
    SwipeDirection = Column(String(5))
    SwipeTime = Column(TIMESTAMP)

class Match(Base):
    __tablename__ = "matches"

    MatchID = Column(Integer, primary_key=True)
    UserID = Column(Integer, ForeignKey('users.UserID'), nullable=False)
    UserID2 = Column(Integer, ForeignKey('users.UserID'), nullable=False)
    MatchTime = Column(TIMESTAMP)
    

class Message(Base):
    __tablename__ = "messages"

    MessageID = Column(Integer, primary_key=True)
    UserID = Column(Integer, ForeignKey('users.UserID'), nullable=False)
    MatchID = Column(Integer, ForeignKey('matches.MatchID'), nullable=False)
    Content = Column(String(1000))

class Interest(Base):
    __tablename__ = "interests"

    InterestID = Column(Integer, primary_key=True)
    InterestName = Column(String(50))

class ProfileInterest(Base):
    __tablename__ = "profileinterests"

    ProfileInterestID = Column(Integer, primary_key=True)
    ProfileID = Column(Integer, ForeignKey('profiles.ProfileID'), nullable=False)
    InterestID = Column(Integer, ForeignKey('interests.InterestID'), nullable=False)

class Desire(Base):
    __tablename__ = "desires"

    DesireID = Column(Integer, primary_key=True)
    ProfileID = Column(Integer, ForeignKey('profiles.ProfileID'), nullable=False)
    MinAge = Column(Integer)
    MaxAge = Column(Integer)
    SexOrientation = Column(String(50))

class DesiredInterest(Base):
    __tablename__ = "desiredinterests"

    DesiredInterestID = Column(Integer, primary_key=True)
    DesireID = Column(Integer, ForeignKey('desires.DesireID'), nullable=False)
    InterestID = Column(Integer, ForeignKey('interests.InterestID'), nullable=False)

class UserSwipe(Base):
    __tablename__ = "userswipes"

    UserSwipeID = Column(Integer, primary_key=True)
    UserID = Column(Integer, ForeignKey('users.UserID'), nullable=False)
    SwipeID = Column(Integer, ForeignKey('swipes.SwipeID'), nullable=False)

#User.profiles = relationship("Profile", order_by=Profile.UserID, back_populates="user")
#Photo.profiles = relationship("Profile", order_by=Profile.PhotoID, back_populates="photo")
