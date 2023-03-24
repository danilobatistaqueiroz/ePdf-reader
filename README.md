
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
ionic cap copy

export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ionic capacitor run android --livereload --external
```


É possível ouvir os eventos de volumeButtonDown, eventos de teclado, mouse, etc.

o arquivo encontra-se no AndroidStudio em:  
Android->app->capacitor-android->java->com.getcapacitor->CapacitorWebView

no vscode encontra-se em:  
node_modules/@capacitor/android/capacitor/src/main/java/com/getcapacitor/CapacitorWebView.java

exemplo de código para desabilitar volumeButtonDown e Up:  
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

criar uma nova Empty Activity e nomeá-la SplashActivity:  
SplashActivity.java
```java
package io.ionic.booksreader;

import android.content.Intent;
import android.os.Handler;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;

public class SplashActivity extends AppCompatActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    new Handler().postDelayed(new Runnable() {


      @Override
      public void run() {
        // This method will be executed once the timer is over
        Intent i = new Intent(SplashActivity.this, MainActivity.class);
        startActivity(i);
        finish();
      }
    }, 3000);
  }
}

```

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

Adicionar um style no arquivo res/layout/styles.xml  
```xml
    <style name="AppTheme.NoActionBarLaunch" parent="AppTheme.NoActionBar">
      <item name="android:background">@drawable/splash</item>
    </style>
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
    android:id="@+id/imageView"
    android:layout_width="72dp"
    android:layout_height="72dp"
    android:src="@drawable/splash"
    app:layout_constraintBottom_toBottomOf="parent"
    app:layout_constraintLeft_toLeftOf="parent"
    app:layout_constraintRight_toRightOf="parent"
    app:layout_constraintTop_toTopOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>
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

para:  
drawable-port-hdpi,
drawable-port-mdpi,
drawable-port-xhdpi,
drawable-port-xxhdpi,
drawable-port-xxxhdpi

copiar para a pasta android/app/src/main/res


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



