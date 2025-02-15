from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from fastapi.responses import FileResponse
from pydantic import BaseModel, field_validator
from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File, Query
from pydantic import BaseModel, validator
from datetime import datetime
from typing import Annotated, Optional
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import or_
from pathlib import Path
import shutil
import os


app = FastAPI()
origins =['http://localhost:3000','http://localhost:3000/update','http://localhost:3000/signup']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Corrected the argument name here
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']  # Corrected the argument name here
)

#apis

# Users

class UserBase(BaseModel):
    
    FirstName: str
    LastName: str
    Email: str
    Age: int
    Gender: str
    Location: str

class UserModel(UserBase):
    UserID: int

    class Config:
        orm_mode = True
        
# Profiles
        
class ProfileBase(BaseModel):
    UserID: int
    PhotoID:int
    Bio: str
    
class ProfileModel(ProfileBase):
    ProfileID: int

    class Config:
        orm_mode = True

# ProfileInterests

class ProfileInterestBase(BaseModel):
    ProfileID: int
    InterestID: int

class ProfileInterestModel(ProfileInterestBase):
    ProfileInterestID: int

    class Config:
        orm_mode = True

# Desires

class DesireBase(BaseModel):
    ProfileID: int
    MinAge: int
    MaxAge: int
    SexOrientation: str

class DesireModel(DesireBase):
    DesireID: int

    class Config:
        orm_mode = True

# DesiredInterests

class DesiredInterestBase(BaseModel):
    DesireID: int
    InterestID: int

class DesiredInterestModel(DesiredInterestBase):
    DesiredInterestID: int

    class Config:
        orm_mode = True

# Swipes

class SwipeBase(BaseModel):
    UserID: int
    ProfileID: int
    SwipeDirection: str
    SwipeTime: datetime
    
class SwipeModel(SwipeBase):
    SwipeID: int

    class Config:
        orm_mode = True
        
# UserSwipes

class UserSwipeBase(BaseModel):
    UserID: int
    SwipeID: int
    
class UserSwipeModel(UserSwipeBase):
    UserSwipeID: int

    class Config:
        orm_mode = True
        
# Interests

class InterestBase(BaseModel):
    InterestName: str
    
class InterestModel(InterestBase):
    InterestID: int

    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
# Messages

class MessageBase(BaseModel):
    UserID: int
    MatchID: int
    Content: str
    
class MessageModel(MessageBase):
    MessageID: int

    class Config:
        orm_mode = True
        
# Matches

class MatchBase(BaseModel):
    UserID: int
    UserID2: int
    MatchTime: datetime
    
class MatchModel(MatchBase):
    MatchID: int

    class Config:
        orm_mode = True
        
# Photos

class PhotoBase(BaseModel):
    file_name: str
    file_path: str
    UploadTime: datetime
    
class PhotoModel(PhotoBase):
    PhotoID: int

    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
models.Base.metadata.create_all(bind=engine )

# users

@app.post("/users/", status_code=status.HTTP_201_CREATED, response_model=UserModel)
async def create_user(user: UserBase, db: db_dependency):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.put("/users/{user_id}", response_model=UserBase)
async def update_user(user_id: int, user: UserBase, db: db_dependency):
    db_user = db.query(models.User).filter(models.User.UserID == user_id).first()
    if db_user:
        for key, value in user.dict().items():
            setattr(db_user, key, value)
        db.commit()
        return db_user
    else:
        raise HTTPException(status_code=404, detail="User not found")

@app.get("/users/{user_id}", status_code=status.HTTP_200_OK)
async def read_user(user_id: int, db: db_dependency):
    db_user = db.query(models.User).filter(models.User.UserID == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail='User not found')
    return db_user

@app.get("/users/other/{user_id}", status_code=status.HTTP_200_OK)
async def read_user(user_id: int, db: db_dependency):
    db_user = db.query(models.User).filter(models.User.UserID != user_id).all()
    if db_user is None:
        raise HTTPException(status_code=404, detail='User not found')
    return db_user

@app.get("/users/", status_code=status.HTTP_200_OK)
async def read_user(db: db_dependency):
    db_user = db.query(models.User).all()
    if db_user is None:
        raise HTTPException(status_code=404, detail='User not found')
    return db_user

@app.delete("/users/{user_id}", status_code=status.HTTP_200_OK)
async def delete_user(user_id: int, db: db_dependency):
    db_user = db.query(models.User).filter(models.User.UserID == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()

# profiles

@app.post("/profiles/", status_code=status.HTTP_201_CREATED, response_model=ProfileModel)
async def create_profile(profile: ProfileBase, db: db_dependency):
    db_profile = models.Profile(**profile.dict())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@app.put("/profiles/{profile_id}", response_model=ProfileBase)
async def update_profile(profile_id: int, profile: ProfileBase, db: db_dependency):
    db_profile = db.query(models.Profile).filter(models.Profile.ProfileID == profile_id).first()
    if db_profile:
        for key, value in profile.dict().items():
            setattr(db_profile, key, value)
        db.commit()
        return db_profile
    else:
        raise HTTPException(status_code=404, detail="Profile not found")

@app.get("/profiles/{profile_id}", status_code=status.HTTP_200_OK)
async def read_profile(profile_id: int, db: db_dependency):
    db_profile = db.query(models.Profile).filter(models.Profile.ProfileID == profile_id).first()
    if db_profile is None:
        raise HTTPException(status_code=404, detail='Profile not found')
    return db_profile

@app.get("/profiles/user/{user_id}", status_code=status.HTTP_200_OK)
async def read_profile(user_id: int, db: db_dependency):
    db_profile = db.query(models.Profile).filter(models.Profile.UserID == user_id).first()
    if db_profile is None:
        raise HTTPException(status_code=404, detail='Profile not found')
    return db_profile

@app.get("/profiles/other/user/{user_id}", status_code=status.HTTP_200_OK)
async def read_profile(user_id: int, db: db_dependency):
    db_profile = db.query(models.Profile).filter(models.Profile.UserID != user_id).all()
    if db_profile is None:
        raise HTTPException(status_code=404, detail='Profile not found')
    return db_profile

@app.delete("/profiles/{profile_id}", status_code=status.HTTP_200_OK)
async def delete_profile(profile_id: int, db: db_dependency):
    db_profile = db.query(models.Profile).filter(models.Profile.ProfileID == profile_id).first()
    if db_profile is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_profile)
    db.commit()

# desires

@app.post("/desires/", status_code=status.HTTP_201_CREATED, response_model=DesireModel)
async def create_desire(desire: DesireBase, db: db_dependency):
    db_desire = models.Desire(**desire.dict())
    db.add(db_desire)
    db.commit()
    db.refresh(db_desire)
    return db_desire

@app.put("/desires/{desire_id}", response_model=DesireBase)
async def update_desire(desire_id: int, desire: DesireBase, db: db_dependency):
    db_desire = db.query(models.Desire).filter(models.Desire.DesireID == desire_id).first()
    if db_desire:
        for key, value in desire.dict().items():
            setattr(db_desire, key, value)
        db.commit()
        return db_desire
    else:
        raise HTTPException(status_code=404, detail="Desire not found")

@app.get("/desires/{desire_id}", status_code=status.HTTP_200_OK)
async def read_desire(desire_id: int, db: db_dependency):
    db_desire = db.query(models.Desire).filter(models.Desire.DesireID == desire_id).first()
    if db_desire is None:
        raise HTTPException(status_code=404, detail='Desire not found')
    return db_desire

@app.delete("/desires/{desire_id}", status_code=status.HTTP_200_OK)
async def delete_desire(desire_id: int, db: db_dependency):
    db_desire = db.query(models.Desire).filter(models.Desire.DesireID == desire_id).first()
    if db_desire is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_desire)
    db.commit()

# DesiredInterests

@app.post("/DesiredInterests/", status_code=status.HTTP_201_CREATED, response_model=DesiredInterestModel)
async def create_DesiredInterest(DesiredInterest: DesiredInterestBase, db: db_dependency):
    db_DesiredInterest = models.DesiredInterest(**DesiredInterest.dict())
    db.add(db_DesiredInterest)
    db.commit()
    db.refresh(db_DesiredInterest)
    return db_DesiredInterest

@app.put("/DesiredInterests/{DesiredInterest_id}", response_model=DesiredInterestBase)
async def update_DesiredInterest(DesiredInterest_id: int, DesiredInterest: DesiredInterestBase, db: db_dependency):
    db_DesiredInterest = db.query(models.DesiredInterest).filter(models.DesiredInterest.DesiredInterestID == DesiredInterest_id).first()
    if db_DesiredInterest:
        for key, value in DesiredInterest.dict().items():
            setattr(db_DesiredInterest, key, value)
        db.commit()
        return db_DesiredInterest
    else:
        raise HTTPException(status_code=404, detail="Desired interest not found")

@app.get("/DesiredInterests/{DesiredInterest_id}", status_code=status.HTTP_200_OK)
async def read_DesiredInterest(DesiredInterest_id: int, db: db_dependency):
    db_DesiredInterest = db.query(models.DesiredInterest).filter(models.DesiredInterest.DesiredInterestID == DesiredInterest_id).first()
    if db_DesiredInterest is None:
        raise HTTPException(status_code=404, detail='Desired interest not found')
    return db_DesiredInterest

@app.delete("/DesiredInterests/{DesiredInterest_id}", status_code=status.HTTP_200_OK)
async def delete_DesiredInterest(DesiredInterest_id: int, db: db_dependency):
    db_DesiredInterest = db.query(models.DesiredInterest).filter(models.DesiredInterest.DesiredInterestID == DesiredInterest_id).first()
    if db_DesiredInterest is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_DesiredInterest)
    db.commit()

# ProfileInterests

@app.post("/ProfileInterests/", status_code=status.HTTP_201_CREATED, response_model=ProfileInterestModel)
async def create_ProfileInterest(ProfileInterest: ProfileInterestBase, db: db_dependency):
    db_ProfileInterest = models.ProfileInterest(**ProfileInterest.dict())
    db.add(db_ProfileInterest)
    db.commit()
    db.refresh(db_ProfileInterest)
    return db_ProfileInterest

@app.put("/ProfileInterests/{ProfileInterest_id}", response_model=ProfileInterestBase)
async def update_ProfileInterest(ProfileInterest_id: int, ProfileInterest: ProfileInterestBase, db: db_dependency):
    db_ProfileInterest = db.query(models.ProfileInterest).filter(models.ProfileInterest.ProfileInterestID == ProfileInterest_id).first()
    if db_ProfileInterest:
        for key, value in ProfileInterest.dict().items():
            setattr(db_ProfileInterest, key, value)
        db.commit()
        return db_ProfileInterest
    else:
        raise HTTPException(status_code=404, detail="Profile interest not found")

@app.get("/ProfileInterests/{ProfileInterest_id}", status_code=status.HTTP_200_OK)
async def read_ProfileInterest(ProfileInterest_id: int, db: db_dependency):
    db_ProfileInterest = db.query(models.ProfileInterest).filter(models.ProfileInterest.ProfileInterestID == ProfileInterest_id).first()
    if db_ProfileInterest is None:
        raise HTTPException(status_code=404, detail='Profile interest not found')
    return db_ProfileInterest

@app.get("/ProfileInterests/profile/{Profile_id}", status_code=status.HTTP_200_OK)
async def read_ProfileInterest(Profile_id: int, db: db_dependency):
    db_ProfileInterest = db.query(models.ProfileInterest).filter(models.ProfileInterest.ProfileID == Profile_id).all()
    if db_ProfileInterest is None:
        raise HTTPException(status_code=404, detail='Profile interest from profileID not found')
    return db_ProfileInterest

@app.delete("/ProfileInterests/{ProfileInterest_id}", status_code=status.HTTP_200_OK)
async def delete_ProfileInterest(ProfileInterest_id: int, db: db_dependency):
    db_ProfileInterest = db.query(models.ProfileInterest).filter(models.ProfileInterest.ProfileInterestID == ProfileInterest_id).first()
    if db_ProfileInterest is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_ProfileInterest)
    db.commit()

# swipes

@app.post("/swipes/", status_code=status.HTTP_201_CREATED, response_model=SwipeModel)
async def create_swipe(swipe: SwipeBase, db: db_dependency):
    db_swipe = models.Swipe(**swipe.dict())
    db.add(db_swipe)
    db.commit()
    db.refresh(db_swipe)
    return db_swipe

@app.put("/swipes/{swipe_id}", response_model=SwipeBase)
async def update_swipe(swipe_id: int, swipe: SwipeBase, db: db_dependency):
    db_swipe = db.query(models.Swipe).filter(models.Swipe.SwipeID == swipe_id).first()
    if db_swipe:
        for key, value in swipe.dict().items():
            setattr(db_swipe, key, value)
        db.commit()
        return db_swipe
    else:
        raise HTTPException(status_code=404, detail="Swipe not found")

@app.get("/swipes/{swipe_id}", status_code=status.HTTP_200_OK)
async def read_swipe(swipe_id: int, db: db_dependency):
    db_swipe = db.query(models.Swipe).filter(models.Swipe.SwipeID == swipe_id).first()
    if db_swipe is None:
        raise HTTPException(status_code=404, detail='Swipe not found')
    return db_swipe


@app.get("/swipes/profile/{profile_id}", status_code=status.HTTP_200_OK)
async def read_swipe(profile_id: int, db: db_dependency):
    db_swipe = db.query(models.Swipe).filter(models.Swipe.ProfileID == profile_id).first()
    if db_swipe is None:
        raise HTTPException(status_code=404, detail='Swipe not found')
    return db_swipe

@app.get("/swipes/user/{user_id}", status_code=status.HTTP_200_OK)
async def read_swipe(user_id: int, db: db_dependency):
    db_swipe = db.query(models.Swipe).filter(models.Swipe.UserID == user_id).all()
    if db_swipe is None:
        raise HTTPException(status_code=404, detail='Swipe not found')
    return db_swipe

@app.delete("/swipes/{swipe_id}", status_code=status.HTTP_200_OK)
async def delete_swipe(swipe_id: int, db: db_dependency):
    db_swipe = db.query(models.Swipe).filter(models.Swipe.SwipeID == swipe_id).first()
    if db_swipe is None:
        raise HTTPException(status_code=404, detail="Swipe not found")
    db.delete(db_swipe)
    db.commit()
    
# interests

@app.post("/interests/", status_code=status.HTTP_201_CREATED, response_model=InterestModel)
async def create_interest(interest: InterestBase, db: db_dependency):
    db_interest = models.Interest(**interest.dict())
    db.add(db_interest)
    db.commit()
    db.refresh(db_interest)
    return db_interest

@app.put("/interests/{interest_id}", response_model=InterestBase)
async def update_interest(interest_id: int, interest: InterestBase, db: db_dependency):
    db_interest = db.query(models.Interest).filter(models.Interest.InterestID == interest_id).first()
    if db_interest:
        for key, value in interest.dict().items():
            setattr(db_interest, key, value)
        db.commit()
        return db_interest
    else:
        raise HTTPException(status_code=404, detail="Interest not found")

@app.get("/interests/{interest_id}", status_code=status.HTTP_200_OK)
async def read_interest(interest_id: int, db: db_dependency):
    db_interest = db.query(models.Interest).filter(models.Interest.InterestID == interest_id).first()
    if db_interest is None:
        raise HTTPException(status_code=404, detail='Interest not found')
    return db_interest

@app.delete("/interests/{interest_id}", status_code=status.HTTP_200_OK)
async def delete_interest(interest_id: int, db: db_dependency):
    db_interest = db.query(models.Interest).filter(models.Interest.InterestID == interest_id).first()
    if db_interest is None:
        raise HTTPException(status_code=404, detail="Interest not found")
    db.delete(db_interest)
    db.commit()

# UserSwipes

@app.post("/UserSwipes/", status_code=status.HTTP_201_CREATED, response_model=UserSwipeModel)
async def create_UserSwipe(UserSwipe: UserSwipeBase, db: db_dependency):
    db_UserSwipe = models.UserSwipe(**UserSwipe.dict())
    db.add(db_UserSwipe)
    db.commit()
    db.refresh(db_UserSwipe)
    return db_UserSwipe

@app.put("/UserSwipes/{UserSwipe_id}", response_model=UserSwipeBase)
async def update_UserSwipe(UserSwipe_id: int, UserSwipe: UserSwipeBase, db: db_dependency):
    db_UserSwipe = db.query(models.UserSwipe).filter(models.UserSwipe.UserSwipeID == UserSwipe_id).first()
    if db_UserSwipe:
        for key, value in UserSwipe.dict().items():
            setattr(db_UserSwipe, key, value)
        db.commit()
        return db_UserSwipe
    else:
        raise HTTPException(status_code=404, detail="User swipe not found")

@app.get("/UserSwipes/{UserSwipe_id}", status_code=status.HTTP_200_OK)
async def read_UserSwipe(UserSwipe_id: int, db: db_dependency):
    db_UserSwipe = db.query(models.UserSwipe).filter(models.UserSwipe.UserSwipeID == UserSwipe_id).first()
    if db_UserSwipe is None:
        raise HTTPException(status_code=404, detail='User swipe not found')
    return db_UserSwipe

@app.delete("/UserSwipes/{UserSwipe_id}", status_code=status.HTTP_200_OK)
async def delete_UserSwipe(UserSwipe_id: int, db: db_dependency):
    db_UserSwipe = db.query(models.UserSwipe).filter(models.UserSwipe.UserSwipeID == UserSwipe_id).first()
    if db_UserSwipe is None:
        raise HTTPException(status_code=404, detail="User swipe not found")
    db.delete(db_UserSwipe)
    db.commit()

# messages

@app.post("/messages/", status_code=status.HTTP_201_CREATED, response_model=MessageModel)
async def create_message(message: MessageBase, db: db_dependency):
    db_message = models.Message(**message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@app.put("/messages/{message_id}", response_model=MessageBase)
async def update_message(message_id: int, message: MessageBase, db: db_dependency):
    db_message = db.query(models.Message).filter(models.Message.MessageID == message_id).first()
    if db_message:
        for key, value in message.dict().items():
            setattr(db_message, key, value)
        db.commit()
        return db_message
    else:
        raise HTTPException(status_code=404, detail="Message not found")

@app.get("/messages/{message_id}", status_code=status.HTTP_200_OK)
async def read_message(message_id: int, db: db_dependency):
    db_message = db.query(models.Message).filter(models.Message.MessageID == message_id).first()
    if db_message is None:
        raise HTTPException(status_code=404, detail='Message not found')
    return db_message

@app.get("/messages/match/{match_id}", status_code=status.HTTP_200_OK)
async def read_message(match_id: int, db: db_dependency):
    db_message = db.query(models.Message).filter(models.Message.MatchID == match_id).order_by(models.Message.MessageID).all()
    if db_message is None:
        raise HTTPException(status_code=404, detail='Message not found')
    return db_message

@app.delete("/messages/{message_id}", status_code=status.HTTP_200_OK)
async def delete_message(message_id: int, db: db_dependency):
    db_message = db.query(models.Message).filter(models.Message.MessageID == message_id).first()
    if db_message is None:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(db_message)
    db.commit()

# matches

@app.post("/matches/", status_code=status.HTTP_201_CREATED, response_model=MatchModel)
async def create_match(match: MatchBase, db: db_dependency):
    db_match = models.Match(**match.dict())
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    return db_match

@app.put("/matches/{match_id}", response_model=MatchBase)
async def update_match(match_id: int, match: MatchBase, db: db_dependency):
    db_match = db.query(models.Match).filter(models.Match.MatchID == match_id).first()
    if db_match:
        for key, value in match.dict().items():
            setattr(db_match, key, value)
        db.commit()
        return db_match
    else:
        raise HTTPException(status_code=404, detail="Match not found")

@app.get("/matches/{match_id}", status_code=status.HTTP_200_OK)
async def read_match(match_id: int, db: db_dependency):
    db_match = db.query(models.Match).filter(models.Match.MatchID == match_id).first()
    if db_match is None:
        raise HTTPException(status_code=404, detail='Match not found')
    return db_match

@app.get("/matches/user/{User_id}", status_code=status.HTTP_200_OK)
async def read_match(User_id: int, db: db_dependency):
    db_match = db.query(models.Match).filter(
        or_(
            models.Match.UserID == User_id,
            models.Match.UserID2 == User_id
        )
    ).all()
    if db_match is None:
        raise HTTPException(status_code=404, detail='Matches from UserID not found')
    return db_match


@app.delete("/matches/{match_id}", status_code=status.HTTP_200_OK)
async def delete_match(match_id: int, db: db_dependency):
    db_match = db.query(models.Match).filter(models.Match.MatchID == match_id).first()
    if db_match is None:
        raise HTTPException(status_code=404, detail="Match not found")
    db.delete(db_match)
    db.commit()
    
# photos

@app.post("/photos/", status_code=status.HTTP_201_CREATED, response_model=PhotoModel)
async def create_photo(db: db_dependency, photo: UploadFile = File(...)):
    dir_name = "Photos"
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)

    file_location = f"{dir_name}/{photo.filename}"
    with open(Path(file_location), "wb") as buffer:
        shutil.copyfileobj(photo.file, buffer)

    db_photo = models.Photo(
        file_name=photo.filename,
        file_path=file_location,
        UploadTime=datetime.now()
    )
    db.add(db_photo)
    db.commit()
    db.refresh(db_photo)
    return db_photo

@app.put("/photos/{photo_id}", response_model=PhotoModel)
async def update_photo(db: db_dependency, photo_id: int, photo: UploadFile = File(...)):
    # Query the old photo
    db_photo = db.query(models.Photo).filter(models.Photo.PhotoID == photo_id).first()
    if db_photo:
        # Delete the old file from the file system
        if os.path.isfile(db_photo.file_path):
            os.remove(db_photo.file_path)

        # Write the new file
        file_location = f"Photos/{photo.filename}"
        with open(Path(file_location), "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)

        # Update the photo record in the database
        db_photo.file_name = photo.filename
        db_photo.file_path = file_location
        db_photo.UploadTime = datetime.now()
        db.commit()
        db.refresh(db_photo)
        return db_photo
    else:
        raise HTTPException(status_code=404, detail="Photo not found")

@app.get("/photos/{photo_id}", status_code=status.HTTP_200_OK)
async def read_photo(photo_id: int, db: db_dependency):
    db_photo = db.query(models.Photo).filter(models.Photo.PhotoID == photo_id).first()
    if db_photo:
        return FileResponse(db_photo.file_path, media_type="image/jpeg")
    else:
        raise HTTPException(status_code=404, detail="Photo not found")

@app.delete("/photos/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_photo(photo_id: int, db: db_dependency):
    db_photo = db.query(models.Photo).filter(models.Photo.PhotoID == photo_id).first()
    if db_photo:
        # Delete the file from the file system
        if os.path.isfile(db_photo.file_path):
            os.remove(db_photo.file_path)

        # Delete the photo record from the database
        db.delete(db_photo)
        db.commit()
        return {"detail": "Photo deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Photo not found")

#if __name__ == "__main__":
 #   uvicorn.run(app, host="127.0.0.1", port=8000)
    
@app.get("/interests/{interest_id}", status_code=status.HTTP_200_OK)
async def read_interest(interest_id: int, db: db_dependency):
    interest = db.query(models.Interest).filter(models.Interest.InterestID == interest_id).first()
    if interest is None:
        raise HTTPException(status_code=404, detail='Interest not found')
    return interest
