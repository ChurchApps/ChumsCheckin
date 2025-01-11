if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/vishalsharma/.gradle/caches/8.10.2/transforms/80348eae9836826b4026444bfa26e5ed/transformed/hermes-android-0.76.5-debug/prefab/modules/libhermes/libs/android.armeabi-v7a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/vishalsharma/.gradle/caches/8.10.2/transforms/80348eae9836826b4026444bfa26e5ed/transformed/hermes-android-0.76.5-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

