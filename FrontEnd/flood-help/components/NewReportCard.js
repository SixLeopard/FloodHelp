import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import useStyles from '@/constants/style';
import FH_Button from "@/components/navigation/FH_Button";

const NewReportCard = ({
                           location,
                           onLocationPress,
                           floodType,
                           setFloodType,
                           title,
                           setTitle,
                           description,
                           setDescription,
                           photos,
                           onTakePhoto,
                           onPickImage,
                           onRemoveImage,
                           onSubmit,
                           loading,
                           error,
                       }) => {
    const styles = useStyles(); // Use the styles from styles.js

    return (
        <View style={styles.formContainer}>

            {/* Title Input */}
            <View style={styles.descriptionContainer}>
                <Text style={styles.bodyTextBold}>Title</Text>
                <View style={styles.titleInput}>
                    <TextInput
                        style={styles.bodyTextBold}
                        placeholder="Enter a Title"
                        multiline
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>
            </View>

            {/* Location Picker */}
            <TouchableOpacity onPress={onLocationPress} style={styles.locationContainer}>
                <Text style={styles.bodyTextBold}>Location</Text>
                <Text style={styles.bodyTextBold}>{location}</Text>
            </TouchableOpacity>

            {/* Flood Type Picker */}
            <View style={styles.pickerContainer}>
                <Text style={styles.bodyTextBold}>Flood Type</Text>
                <Picker
                    selectedValue={floodType}
                    onValueChange={(itemValue) => setFloodType(itemValue)}
                    style={[styles.picker]}
                >
                    <Picker.Item label="Please select a flood type" value="" />
                    <Picker.Item label="Major Flood" value="Major Flood" />
                    <Picker.Item label="Moderate Flood" value="Moderate Flood" />
                    <Picker.Item label="Minor Flood" value="Minor Flood" />
                    <Picker.Item label="No Flood" value="No Flood" />
                </Picker>
            </View>


            {/* Description Input */}
            <View style={styles.descriptionContainer}>
                <Text style={styles.bodyTextBold}>Description</Text>
                <View style={styles.descriptionInput}>
                    <TextInput
                        style={styles.bodyTextBold}
                        placeholder="Enter a description"
                        multiline
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>
            </View>

            {/* Image Previews */}
            <View style={styles.imageContainer}>
                {photos.map((photo, index) => (
                    <View key={index} style={styles.imagePreviewContainer}>
                        <Text style={styles.imageText}>{photo}</Text>
                        <TouchableOpacity onPress={() => onRemoveImage(index)} style={styles.removeImageButton}>
                            <Text style={styles.removeImageText}>X</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {/* Image Upload and Take Photo Buttons */}
            <View style={styles.imageButtonContainer}>
                <TouchableOpacity onPress={onTakePhoto} style={styles.imageButton}>
                    <Text style={styles.imageButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPickImage} style={styles.imageButton}>
                    <Text style={styles.imageButtonText}>Upload Image</Text>
                </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <FH_Button text="Submit Report" onPress={onSubmit} disabled={loading} />
            {loading && <Text>Submitting...</Text>}
            {error && <Text>Error: {error}</Text>}
        </View>
    );
};

export default NewReportCard;
