# from app import db, app
from flask import Flask
from app import create_app
from app.models import db, User, Directory, Note, Image
app = create_app()

with app.app_context():
    # Drop all tables
    db.drop_all()
    print("All tables dropped.")

    # Create all tables
    db.create_all()
    print("All tables created.")

    # Optionally, add some seed data
    # from app.models import User, Directory, Note, Image

    # Create a user
    user = User(username='testuser', password='testpassword')
    db.session.add(user)
    db.session.commit()

    # Create a directory for the user
    directory = Directory(name='Test Directory', user_id=user.id)
    db.session.add(directory)
    db.session.commit()

    # Create a note in the directory
    note = Note(title='Test Note', directory_id=directory.id)
    db.session.add(note)
    db.session.commit()

    # Create an image for the note
    image = Image(filename='test_image.jpg', note_id=note.id)
    db.session.add(image)
    db.session.commit()

    print("Seed data added.")