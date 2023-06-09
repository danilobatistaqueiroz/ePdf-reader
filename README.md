
debugar celular Android:  
vivaldi://inspect/device#devices  
chrome://inspect/device#devices


lista de comandos:  
```
ionic start iddd --type=angular --capacitor
npm install @capacitor/filesystem
ng serve
ionic build
ionic cap add android
ionic cap copy

npm install capacitor-volume-buttons
npx cap sync
ionic build
ionic cap copy

npm install cordova-plugin-screen-orientation
npm i es6-promise-plugin
npx cap sync
npx cap update
ionic build
ionic cap copy android

export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ionic capacitor run android --livereload --external
```


Com o código abaixo os botões up e down do celular são bloqueados, ficam sem efeito algum

o arquivo encontra-se no AndroidStudio em projeto "capacitor-android":  
Android->app->capacitor-android->java->com.getcapacitor->CapacitorWebView

no vscode encontra-se em:  
node_modules/@capacitor/android/capacitor/src/main/java/com/getcapacitor/CapacitorWebView.java

exemplo de código para desabilitar (assim não altera o som) volumeButtonDown e Up:  
```java
@Override
public boolean dispatchKeyEvent(KeyEvent event) {
    boolean result;
     switch( event.getKeyCode() ) {
        case KeyEvent.KEYCODE_VOLUME_UP:
        case KeyEvent.KEYCODE_VOLUME_DOWN:
            result = true;
            break;

         default:
            result= super.dispatchKeyEvent(event);
            break;
     }

     return result;
}
```

exemplo para volumeButtonDown e Up não alterarem o som:  

o arquivo encontra-se no vscode em:  
node_modules/@capacitor/android/capacitor/src/main/java/com/getcapacitor/BridgeActivity.java 

ou no AndroidStudio em:  
Android->app->capacitor-android->java->com.getcapacitor->BridgeActivity

```java
import android.view.KeyEvent;

  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
    if( keyCode == KeyEvent.KEYCODE_VOLUME_UP ||
      keyCode == KeyEvent.KEYCODE_VOLUME_DOWN)
    {
      event.startTracking();
      return true;
    }
    return super.onKeyDown(keyCode, event);
  }
```


para referenciar um elemento html dentro do typescript é necessário usar no html:  
```html
<ion-slides #slides>
```
e no typescript:  
```typescript
@ViewChild('slides') slider!: any;

  ngAfterViewInit(): void {
    this.slider
  }
```





## Criando o Splash Screen

no Android Studio clique com o direito do mouse na pasta java e escolha novo Activity -> Empty Activity

criar uma nova Empty Activity e nomeá-la SplashActivity:  
SplashActivity.java
```java
package io.ionic.booksreader;

import android.content.Intent;
import android.os.Handler;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.view.WindowManager;
import android.view.animation.AccelerateInterpolator;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.widget.ImageView;

public class SplashActivity extends AppCompatActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
      WindowManager.LayoutParams.FLAG_FULLSCREEN);

    setContentView(R.layout.activity_splash);

    Animation fadeOut = new AlphaAnimation(1, 0);
    fadeOut.setInterpolator(new AccelerateInterpolator());
    fadeOut.setStartOffset(300);
    fadeOut.setDuration(800);
    ImageView image = findViewById(R.id.imageView3);

    image.setAnimation(fadeOut);

    new Handler().postDelayed(new Runnable() {
      @Override
      public void run() {
        // This method will be executed once the timer is over
        Intent i = new Intent(SplashActivity.this, MainActivity.class);
        startActivity(i);
        finish();
      }
    }, 1500);
  }
}
```

em AndroidManifest.xml  
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="io.ionic.booksreader">
    <!-- Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity
            android:name=".SplashActivity"
            android:theme="@style/Theme.Design.NoActionBar"
          android:exported="true">
          <intent-filter>
            <action android:name="android.intent.action.MAIN" />

            <category android:name="android.intent.category.LAUNCHER" />
          </intent-filter>
        </activity>
        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:exported="true"
            android:label="@string/title_activity_main"
            android:launchMode="singleTask"
            android:theme="@style/AppTheme.NoActionBarLaunch">
        </activity>

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
    </application>

</manifest>
```

no Android Studio:  
clique com o direito do mouse na pasta res e escolha novo "Android Resource File"

Criar um arquivo em res/drawable/splash_background.xml  
```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="https://schemas.android.com/apk/res/android">

<item android:drawable="@android:color/black" />
<item>
  <bitmap
    android:gravity="center"
    android:src="@drawable/splash" />
</item>
</layer-list>
```

Adicionar um style no arquivo res/values/styles.xml  
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>

    <!-- Base application theme. -->
    <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
        <!-- Customize your theme here. -->
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
        <item name="colorAccent">@color/colorAccent</item>
    </style>

    <style name="AppTheme.NoActionBar" parent="Theme.AppCompat.DayNight.NoActionBar">
        <item name="windowActionBar">false</item>
        <item name="windowNoTitle">true</item>
        <item name="android:background">@null</item>
    </style>


    <style name="AppTheme.NoActionBarLaunch" parent="Theme.SplashScreen">
        <item name="android:background">@drawable/splash</item>
    </style>
</resources>
```

res/layout/activity_splash.xml  
```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
  xmlns:app="http://schemas.android.com/apk/res-auto"
  xmlns:tools="http://schemas.android.com/tools"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  tools:context=".SplashActivity">

  <ImageView
    android:id="@+id/imageView3"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    app:layout_constraintBottom_toBottomOf="parent"
    app:layout_constraintEnd_toEndOf="parent"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintTop_toTopOf="parent"
    app:srcCompat="@drawable/splash" />
</androidx.constraintlayout.widget.ConstraintLayout>

```

em res/values/strings.xml  
```xml
<?xml version='1.0' encoding='utf-8'?>
<resources>
    <string name="app_name">BooksReader</string>
    <string name="title_activity_main">BooksReader</string>
    <string name="package_name">io.ionic.booksreader</string>
    <string name="custom_url_scheme">io.ionic.booksreader</string>
</resources>
```



Samsung M31 Galaxy tem width x height de: 1080×2340 pixels





## Criando o ícone do app

no Android Studio:  
clique com o direito do mouse na pasta res e escolha novo "Image Asset"

selecione a imagem de 1024x1024 de preferência png

escolha Trim

em Background Layer escolha uma cor

next irá sobreescrever os ícones default

na próxima tela, escolha em "Res Directory" a opção "main"

também é possível gerar os ícones pelo site:  
https://icon.kitchen


## Gerando a imagem de Splash Screen

tutoriais:  
https://www.youtube.com/watch?v=qrad_A5L45E  
https://www.youtube.com/watch?v=9O1lI0BRCCE  

https://apetools.webprofusion.com/#/tools/imagegorilla

selecione uma imagem 2732x2732 de preferência png

descompactar o zip, entrar na pasta bundle/android

renomear todos os arquivos screen.png para splash.png

copie as pastas:  
drawable-hdpi,
drawable-mdpi,
drawable-xhdpi,
drawable-xxhdpi,
drawable-xxxhdpi

e gire as imagens:  
drawable-port-hdpi,
drawable-port-mdpi,
drawable-port-xhdpi,
drawable-port-xxhdpi,
drawable-port-xxxhdpi

se não existir as pastas drawable-land-* ou drawable-port-*  
crie as pastas correspondentes e gire a imagem caso necessário.  

copiar para a pasta android/app/src/main/res/drawable/splash


## Animated Splash Screen

https://loading.io/
https://tobiasahlin.com/spinkit/


## Trabalhando as imagens

for file in *.jpg; do convert $file -resize 30% e$file; done
for file in *.jpg; do convert $file -resize 25% -rotate 90 i$file; done


# Firebase Emulator  

npm i firebase

npm install -g firebase-tools

firebase projects:list

firebase init
firebase init emulators
firebase emulators:start

firebase serve


## Adicionando o Firebase

ng add @angular/fire

logar no site do Firebase console

criar um app
adicionar autenticação
criar uma coleção no firestore

gravar os penmarks    [chapter][page][x1,y1,x2,y2]
gravar os bookmarks   [chapter][page]
gravar as páginas atuais 
gravar as notas 

ler ao carregar






npm install firebase


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDESZDOuoBGnqW_sMjKAdiKjxx-7PuIb7k",
  authDomain: "booksreader-e1dd5.firebaseapp.com",
  projectId: "booksreader-e1dd5",
  storageBucket: "booksreader-e1dd5.appspot.com",
  messagingSenderId: "470342136480",
  appId: "1:470342136480:web:b289764499ee79b7f6cfc5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);





##### PUBLICANDO NA GOOGLE PLAYSTORE ######

https://www.youtube.com/watch?v=-84SHTrPDOg

https://www.youtube.com/watch?v=Vc557vMv5JQ

https://www.youtube.com/watch?v=Wq-KbOj62oM

https://www.youtube.com/watch?v=pvXMIfDepxA