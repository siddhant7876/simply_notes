
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
from werkzeug.utils import secure_filename

from .models import db
jwt = JWTManager()

def create_app():

    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Change this to a random secret key
    base_dir = os.path.abspath(os.path.dirname(__file__))
    app.config['UPLOAD_FOLDER'] = os.path.join(base_dir, 'uploads')

    # app.app_context().push()
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    with app.app_context():
        from .models import User, Note, Image, Directory
        db.create_all()
    # Routes
    # frontend/public/index.html

    from .routes.notes import notes_bp
    from .routes.directories import directories_bp
    from .routes.auth import auth_bp
    from .routes.images import images_bp

    app.register_blueprint(notes_bp, url_prefix='/notes')
    app.register_blueprint(directories_bp, url_prefix='/directories')
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(images_bp, url_prefix='/images')


    @app.route('/')
    def home():
        return send_from_directory('../..', 'frontend/public/index.html')


    # Serve static files
    @app.route('/<path:filename>')
    def static_files(filename):
        return send_from_directory('.', filename)

    return app

# if __name__ == '__main__':
#     # Create the database tables if they don't exist
#     db.create_all()
#     app.run(debug=True)