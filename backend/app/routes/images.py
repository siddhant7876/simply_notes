from flask import Blueprint,request, jsonify,send_from_directory,current_app as app
from flask_jwt_extended import  jwt_required
from app.models import db,Image
import os
import uuid
from werkzeug.utils import secure_filename


images_bp = Blueprint('images', __name__)

@images_bp.route('/upload-image/<int:note_id>', methods=['POST'])
@jwt_required()
def upload_image(note_id):
    if 'file' not in request.files:
        print("NO file part")
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        print("no selected file")
        return jsonify({'message': 'No selected file'}), 400
    if file:
        # file_size = len(file.read())
        # file.seek(0)
        # print("yahoo??",file_size,file.content_length,dir(file))
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
        new_image = Image(filename=unique_filename, note_id=note_id)
        db.session.add(new_image)
        db.session.commit()
        return jsonify({'message': 'Image uploaded successfully'})
    return jsonify({"message": "File upload failed"}), 500 

@images_bp.route('/images/<int:note_id>', methods=['GET'])
@jwt_required()
def get_images(note_id):
    # print(note_id)
    images = Image.query.filter_by(note_id=note_id).all()
    # print(dir(images[0]))
    return jsonify([{'id': img.id, 'filename': img.filename} for img in images])

@images_bp.route('/delete-image/<int:note_id>/<int:image_id>', methods=['DELETE'])
@jwt_required()
def delete_image(note_id, image_id):
    image = Image.query.filter_by(id=image_id, note_id=note_id).first()
    if not image:
        return jsonify({'message': 'Image not found'}), 404

    # Construct the file path
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)

    try:
        # Delete the file from the filesystem
        if os.path.exists(file_path):
            os.remove(file_path)
        else:
            print("The file does not exist")

        # Delete the image record from the database
        db.session.delete(image)
        db.session.commit()

        return jsonify({'message': 'Image deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting image: {e}")
        return jsonify({'message': 'Failed to delete image'}), 500
@images_bp.route('/uploads/<filename>')
def uploaded_file(filename):
    print("filename",filename)
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)