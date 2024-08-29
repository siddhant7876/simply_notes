from flask import Blueprint, request, jsonify,current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
from app.models import db,Directory,Note

directories_bp = Blueprint('directories', __name__)



@directories_bp.route('/create-directory', methods=['POST'])
@jwt_required()
def create_directory():
    data = request.get_json()
    user_id = get_jwt_identity()['id']
    new_directory = Directory(name=data['name'], user_id=user_id)
    db.session.add(new_directory)
    db.session.commit()
    return jsonify({'message': 'Directory created successfully'})

@directories_bp.route('/directories', methods=['GET'])
@jwt_required()
def get_directories():
    user_id = get_jwt_identity()['id']
    # print(user_id)
    if isinstance(user_id, str):
        user_id = int(user_id)  # Ensure user_id is an integer
    directories = Directory.query.filter_by(user_id=user_id).all()
    return jsonify([{'id': d.id, 'name': d.name} for d in directories])

@directories_bp.route('/directories/<int:directory_id>', methods=['DELETE'])
@jwt_required()
def delete_directory(directory_id):
    try:
        user_id = get_jwt_identity()['id']
        directory = Directory.query.filter_by(id=directory_id, user_id=user_id).first()
        if not directory:
            return jsonify({'message': 'Directory not found'}), 404

        # Delete associated notes and images
        for note in directory.notes:
            for image in note.images:
                image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
                if os.path.exists(image_path):
                    os.remove(image_path)
                db.session.delete(image)
            db.session.delete(note)

        db.session.delete(directory)
        db.session.commit()
        return jsonify({'message': 'Directory deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to delete directory', 'error': str(e)}), 500
    


@directories_bp.route('/directories/<int:directory_id>/notes', methods=['GET'])
@jwt_required()
def get_notes_for_directory(directory_id):
    try:
        user_id = get_jwt_identity()['id']
        directory = Directory.query.filter_by(id=directory_id, user_id=user_id).first()
        if not directory:
            return jsonify({'message': 'Directory not found'}), 404

        notes = Note.query.filter_by(directory_id=directory_id).all()
        notes_data = [{'id': note.id, 'title': note.title} for note in notes]

        return jsonify({'notes': notes_data}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch notes', 'error': str(e)}), 500
    