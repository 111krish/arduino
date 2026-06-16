#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$PROJECT_DIR/app"
SRC_DIR="$APP_DIR/src/main"
BUILD_DIR="$PROJECT_DIR/build"

ANDROID_SDK="/usr/lib/android-sdk"
BUILD_TOOLS="$ANDROID_SDK/build-tools/29.0.3"
PLATFORM_JAR="$ANDROID_SDK/platforms/android-23/android.jar"
AAPT="$BUILD_TOOLS/aapt"
APKSIGNER="$BUILD_TOOLS/apksigner"
ZIPALIGN="$BUILD_TOOLS/zipalign"
DX="$ANDROID_SDK/build-tools/debian/dx"

KEYSTORE="$PROJECT_DIR/debug.keystore"
PACKAGE="com.researcherapp.mobile"

echo "==> Cleaning build directory"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"/{gen,obj,dex,apk}

# --- 1. Generate R.java ---
echo "==> Generating R.java with aapt"
"$AAPT" package -f -m \
    -J "$BUILD_DIR/gen" \
    -M "$SRC_DIR/AndroidManifest.xml" \
    -S "$SRC_DIR/res" \
    -I "$PLATFORM_JAR"

# --- 2. Compile Java sources ---
echo "==> Compiling Java sources"
find "$SRC_DIR/java" "$BUILD_DIR/gen" -name "*.java" > "$BUILD_DIR/sources.txt"
javac -source 1.8 -target 1.8 \
    -classpath "$PLATFORM_JAR" \
    -d "$BUILD_DIR/obj" \
    @"$BUILD_DIR/sources.txt"

# --- 3. Convert to DEX ---
echo "==> Converting class files to DEX"
"$DX" --dex --min-sdk-version=26 --output="$BUILD_DIR/dex/classes.dex" "$BUILD_DIR/obj"

# --- 4. Package resources ---
echo "==> Packaging resources into APK"
"$AAPT" package -f \
    -M "$SRC_DIR/AndroidManifest.xml" \
    -S "$SRC_DIR/res" \
    -I "$PLATFORM_JAR" \
    -F "$BUILD_DIR/apk/researcher-app.unsigned.apk"

# --- 5. Add DEX to APK ---
echo "==> Adding DEX to APK"
cd "$BUILD_DIR/dex"
zip -u "$BUILD_DIR/apk/researcher-app.unsigned.apk" classes.dex
cd "$PROJECT_DIR"

# --- 6. Generate keystore if missing ---
if [ ! -f "$KEYSTORE" ]; then
    echo "==> Generating debug keystore"
    keytool -genkeypair -v \
        -keystore "$KEYSTORE" \
        -alias androiddebugkey \
        -keyalg RSA -keysize 2048 \
        -validity 10000 \
        -storepass android \
        -keypass android \
        -dname "CN=Android Debug,O=Android,C=US"
fi

# --- 7. Sign APK ---
echo "==> Signing APK"
"$APKSIGNER" sign \
    --ks "$KEYSTORE" \
    --ks-pass pass:android \
    --key-pass pass:android \
    --ks-key-alias androiddebugkey \
    --out "$BUILD_DIR/apk/researcher-app.signed.apk" \
    "$BUILD_DIR/apk/researcher-app.unsigned.apk"

# --- 8. Zipalign ---
echo "==> Aligning APK"
"$ZIPALIGN" -f 4 \
    "$BUILD_DIR/apk/researcher-app.signed.apk" \
    "$BUILD_DIR/apk/researcher-app.apk"

echo ""
echo "✓ APK built successfully:"
echo "  $BUILD_DIR/apk/researcher-app.apk"
ls -lh "$BUILD_DIR/apk/researcher-app.apk"
