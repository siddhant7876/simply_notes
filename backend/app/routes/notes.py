from flask import Blueprint,request, jsonify,current_app as app
from flask_jwt_extended import  jwt_required, get_jwt_identity
from app.models import db,Note,Directory
import os

notes_bp = Blueprint('notes', __name__)


@notes_bp.route('/create-note', methods=['POST'])
@jwt_required()
def create_note():
    data = request.get_json()
    print(data)
    try:
        user_id = get_jwt_identity()['id']
        directory_id = data.get('directory_id')
        title = data.get('title')

        directory = Directory.query.filter_by(id=directory_id, user_id=user_id).first()
        if not directory:
            return jsonify({'message': 'Directory not found'}), 404

        note = Note(title=title, directory_id=directory_id)
        db.session.add(note)
        db.session.commit()

        return jsonify({'message': 'Note created successfully', 'note': {'id': note.id, 'title': note.title}}), 201
    except Exception as e:
        return jsonify({'message': 'Failed to create note', 'error': str(e)}), 500

@notes_bp.route('/notes/<int:directory_id>', methods=['GET'])
@jwt_required()
def get_notes(directory_id):
    notes = Note.query.filter_by(directory_id=directory_id).all()
    return jsonify([{'id': n.id, 'title': n.title} for n in notes])

@notes_bp.route('/notes/<int:note_id>', methods=['DELETE'])
@jwt_required()
def delete_note(note_id):
    try:
        note = Note.query.get(note_id)
        if not note:
            return jsonify({'message': 'Note not found'}), 404

        # Delete associated images
        for image in note.images:
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
            if os.path.exists(image_path):
                os.remove(image_path)
            db.session.delete(image)

        db.session.delete(note)
        db.session.commit()
        return jsonify({'message': 'Note deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to delete note', 'error': str(e)}), 500




