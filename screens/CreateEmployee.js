import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Alert, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const CreateEmployee = ({ navigation, route }) => {

    const getDetails = (type) => {
        if (route.params) {
            switch (type) {
                case "name":
                    return route.params.name
                case "phone":
                    return route.params.phone
                case "email":
                    return route.params.email
                case "picture":
                    return route.params.picture
                case "salary":
                    return route.params.salary
                case "position":
                    return route.params.position
            }
        }
        return ""
    }

    const [name, setName] = useState(getDetails("name"))
    const [phone, setPhone] = useState(getDetails("phone"))
    const [email, setEmail] = useState(getDetails("email"))
    const [salary, setSalary] = useState(getDetails("salary"))
    const [picture, setPicture] = useState(getDetails("picture"))
    const [position, setPosition] = useState(getDetails("position"))
    const [modal, setModal] = useState(false)
    const [enableShift, setEnableShift] = useState(false)

    const url = "http://10.0.2.2:3000";

    const submitData = () => {
        fetch(`${url}/send-data`, {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                picture,
                position,
                salary
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                Alert.alert(`${data.name} is saved successfully`)
                navigation.navigate("Home")
            }).catch(err => {
                Alert.alert("Something went Wrong")
            })
    }


    const updateDetails = () => {
        fetch(`${url}/update`, {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                id: route.params._id,
                name,
                email,
                phone,
                picture,
                position,
                salary
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                Alert.alert(`${data.name} is updated successfully`)
                navigation.navigate("Home")
            }).catch(err => {
                Alert.alert("Something went Wrong")
            })
    }

    const pickFromGallery = async () => {
        const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if (granted) {
            let data = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5
            })
            //console.log(data)
            if (!data.cancelled) {
                let newfile = {
                    uri: data.uri,
                    type: `test/${data.uri.split(".")[1]}`,
                    name: `test.${data.uri.split(".")[1]}`
                }
                handleUpload(newfile)
            }
        } else {
            Alert.alert("You need to give us permission to work")
        }
    }

    const pickFromCamera = async () => {
        const { granted } = await Permissions.askAsync(Permissions.CAMERA)
        if (granted) {
            let data = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5
            })
            //console.log(data)
            if (!data.cancelled) {
                let newfile = {
                    uri: data.uri,
                    type: `test/${data.uri.split(".")[1]}`,
                    name: `test.${data.uri.split(".")[1]}`
                }
                handleUpload(newfile)
            }
        } else {
            Alert.alert("You need to give us permission to work")
        }
    }

    const handleUpload = (image) => {
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', 'employeeApp')
        data.append('cloud_name', 'denuw6irr')

        fetch("https://api.cloudinary.com/v1_1/denuw6irr/image/upload", {
            method: "post",
            body: data
        }).then(res => res.json()).
            then(data => {
                console.log(data)
                setPicture(data.url)
                setModal(false)
            }).catch(err => {
                Alert.alert("Error while Uploading")
            })
    }


    return (
        <KeyboardAvoidingView behavior="position" style={styles.root} enabled={enableShift}>
            <View>
                <TextInput
                    label='Name'
                    mode="outlined"
                    theme={theme}
                    value={name}
                    onFocus={() => setEnableShift(false)}
                    onChangeText={text => setName(text)}
                    style={styles.inputStyle}
                />
                <TextInput
                    label='Email'
                    mode="outlined"
                    theme={theme}
                    value={email}
                    onFocus={() => setEnableShift(false)}
                    onChangeText={text => setEmail(text)}
                    style={styles.inputStyle}
                />
                <TextInput
                    label='Phone'
                    mode="outlined"
                    theme={theme}
                    value={phone}
                    onFocus={() => setEnableShift(false)}
                    onChangeText={text => setPhone(text)}
                    style={styles.inputStyle}
                    keyboardType="number-pad"
                />
                <TextInput
                    label='Salary'
                    mode="outlined"
                    theme={theme}
                    value={salary}
                    onFocus={() => setEnableShift(true)}
                    onChangeText={text => setSalary(text)}
                    style={styles.inputStyle}
                />
                <TextInput
                    label='Position'
                    mode="outlined"
                    theme={theme}
                    value={position}
                    onFocus={() => setEnableShift(true)}
                    onChangeText={text => setPosition(text)}
                    style={styles.inputStyle}
                />
                <Button style={styles.inputStyle} theme={theme} icon={picture == "" ? "upload" : "check"} mode="contained" onPress={() => setModal(true)}>
                    Upload Image
            </Button>
                {route.params ?
                    <Button style={styles.inputStyle} theme={theme} icon="content-save" mode="contained" onPress={() => updateDetails()}>
                        Update Details
                    </Button>
                    :
                    <Button style={styles.inputStyle} theme={theme} icon="content-save" mode="contained" onPress={() => submitData()}>
                        Save
                    </Button>
                }
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modal}
                    onRequestClose={() => {
                        setModal(false)
                    }}
                >
                    <View style={styles.modalView}>
                        <View style={styles.modalButtonView}>
                            <Button theme={theme} icon="camera" mode="contained" onPress={() => pickFromCamera()}>
                                Camera
                        </Button>
                            <Button theme={theme} icon="image-area" mode="contained" onPress={() => pickFromGallery()}>
                                Gallery
                        </Button>
                        </View>
                        <Button style={styles.inputStyle} theme={theme} onPress={() => setModal(false)}>
                            Cancel
                    </Button>
                    </View>
                </Modal>
            </View>
        </KeyboardAvoidingView>
    )
}

const theme = {
    colors: {
        primary: "#006aff"
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    inputStyle: {
        margin: 5,
        marginLeft: 10,
        marginRight: 10,
    },
    modalView: {
        position: "absolute",
        bottom: 2,
        width: "100%",
        backgroundColor: "#fff"
    },
    modalButtonView: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }
})


export default CreateEmployee