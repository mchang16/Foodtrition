import React from 'react';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { Text, View, TouchableOpacity } from 'react-native';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            response: '',
        }
    }

    async press() {
        if (this.camera) {
            console.log('Taking photo');
            let photo = await this.camera.takePictureAsync();
            console.log(photo);
            this.props.imageLoc = photo.uri;

            const data = new FormData();
            data.append('photo', {
                uri: photo.uri,
                type: photo.type,
                name: photo.name
            });


            fetch('http://192.168.254.196:5000/api/string', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // str: "#include <iostream> int main(void) { std::cout << \"Holy shit.\" << std::endl; return 0;}",
                    data
                }),
                body: data
            }).then((res) => res.json())
                // .then((data) => {console.log('data', data.ParsedResults[0].ParsedText);  })
                .then((data) => {
                    ret = this.confirmData(data.ParsedResults[0].ParsedText);

                    this.setState({ response: data.ParsedResults[0].ParsedText })
                })
                .catch((err) => console.log(err))

            this.props.action(this.state.response);

        }
    }

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    render() {
        const {hasCameraPermission } = this.state;
        if (hasCameraPermission === null)
            return <View />
        else if (!hasCameraPermission)
            return <Text>No access to camera</Text>
        else

        return (
            <Camera
                style={{ flex: 1 }}
                ref={(ref) => { this.camera = ref }}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            alignSelf: 'flex-end',
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            this.press();
                        }}>
                        <Text style={{ fontSize: 130, marginBottom: 60, color: 'white' }}> O </Text>
                    </TouchableOpacity>
                </View>
            </Camera>
        );
    }
}
