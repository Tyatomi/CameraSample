import React from 'react';
import { Button, Text, View, TouchableOpacity, sclo, CameraRoll, Image, StatusBar,Platform, StyleSheet } from 'react-native';
import { Camera, Permissions, FileSystem, ImagePicker, GLView, Constants } from 'expo';


const styles = StyleSheet.create({
  view: {
    //paddingTop: Constants.statusBarHeight, 
    flex: 1,
  },
  statusBar: {
    //paddingTop: Constants.statusBarHeight, 
  },
  camera: {
    paddingTop: Constants.statusBarHeight, 
    flex: 1,
  },
  image : {
    width:80,
    height:300,
    marginLeft: 250,
    marginTop: 240,    
  }
});

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  //画像保存メソッド
  snap = async () => {
    if (this.camera) {
      //画像をキャッシュメモリに一時的に保存
      //let photo = await this.camera.takePictureAsync();
     // let photo = await Expo.takeSnapshotAsync(snap,);
      
      //const targetPixelCount = 1080; // If you want full HD pictures
      //const pixelRatio = PixelRatio.get(); // The pixel ratio of the device
      //const pixels = targetPixelCount / pixelRatio;
      
      //ファイル名
      const filename = new Date().getTime() + '.jpg';
      //ファイルの保存先
      const imageUri = Expo.FileSystem.documentDirectory + filename;
     
      const uri = await Expo.takeSnapshotAsync(this.refs.snap, {
        result: "file",
        height: 900,
        width: 500,
        quality: 1,
        format: 'jpg',
        });

      //画像をファイルにコピーし保存
      await Expo.FileSystem.copyAsync({from: uri, to: imageUri});
      //カメラロールに保存
      await CameraRoll.saveToCameraRoll(imageUri, 'photo');
      
    }
  };

  

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={styles.view} >
       
          <StatusBar hidden={true} />
          <View 
              ref="snap"
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <Camera style={styles.camera} type={this.state.type} ref={ref => { this.camera = ref; }}>
               <Image source={require('./img/sample01.png')} style={styles.image}/>
            </Camera>
            </View>

          <Button onPress={this.snap}title="press" />
        </View>
      );
    }
  }

}