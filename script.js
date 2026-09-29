// =====================================================
// NEAR MISS REPORTING SYSTEM
// PHOTO + VIDEO VERSION
// VIDEO LIMIT: 20 MB
// =====================================================


// =====================================================
// GET HTML ELEMENTS
// =====================================================

const form =
    document.getElementById("nearMissForm");

const successMessage =
    document.getElementById("successMessage");

const dateTime =
    document.getElementById("dateTime");

const photoInput =
    document.getElementById("photo");

const photoCount =
    document.getElementById("photoCount");

const videoInput =
    document.getElementById("video");

const videoInfo =
    document.getElementById("videoInfo");


// =====================================================
// GOOGLE APPS SCRIPT URL
// =====================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyvYdD4VfoUM-vD5yS2AdJ_vCSNOU3TE6qY1J9ZIqFHqndGF-a_LXbX0GDmmU3A5VRrIw/exec";


// =====================================================
// SETTINGS
// =====================================================

const MAX_PHOTOS = 10;

const MAX_PHOTO_SIZE =
    10 * 1024 * 1024;

// VIDEO LIMIT = 20 MB

const MAX_VIDEO_SIZE =
    20 * 1024 * 1024;

const MAX_WIDTH = 1200;

const MAX_HEIGHT = 1200;

const JPEG_QUALITY = 0.75;


// =====================================================
// CONFIRM SCRIPT LOADED
// =====================================================

console.log(
    "================================="
);

console.log(
    "NEAR MISS script.js loaded"
);

console.log(
    "PHOTO + VIDEO VERSION"
);

console.log(
    "VIDEO LIMIT: 20 MB"
);

console.log(
    "================================="
);


// =====================================================
// PHOTO COUNTER
// =====================================================

if (
    photoInput &&
    photoCount
) {

    photoInput.addEventListener(
        "change",
        function () {

            const count =
                photoInput.files.length;


            if (count === 0) {

                photoCount.textContent =
                    "No photos selected";

                return;

            }


            if (
                count >
                MAX_PHOTOS
            ) {

                photoCount.textContent =
                    "❌ Maximum 10 photos allowed";

                return;

            }


            photoCount.textContent =
                "📷 " +
                count +
                " photo(s) selected";

        }
    );

}


// =====================================================
// VIDEO INFORMATION
// =====================================================

if (
    videoInput &&
    videoInfo
) {

    videoInput.addEventListener(
        "change",
        function () {

            const file =
                videoInput.files[0];


            if (!file) {

                videoInfo.textContent =
                    "No video selected";

                return;

            }


            const sizeMB =
                file.size /
                (1024 * 1024);


            console.log(
                "Video selected:",
                file.name,
                sizeMB.toFixed(2) +
                " MB"
            );


            // ---------------------------------------------
            // CHECK VIDEO SIZE
            // ---------------------------------------------

            if (
                file.size >
                MAX_VIDEO_SIZE
            ) {

                videoInfo.textContent =
                    "❌ Video must be 20 MB or smaller";

                videoInput.value = "";

                return;

            }


            videoInfo.textContent =
                "🎥 " +
                file.name +
                " (" +
                sizeMB.toFixed(1) +
                " MB)";

        }
    );

}


// =====================================================
// GENERATE REPORT NUMBER
// =====================================================

function generateReportNumber() {

    const now =
        new Date();


    const malaysiaTime =
        new Date(
            now.toLocaleString(
                "en-US",
                {
                    timeZone:
                        "Asia/Kuala_Lumpur"
                }
            )
        );


    const year =
        malaysiaTime.getFullYear();


    const month =
        String(
            malaysiaTime.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            malaysiaTime.getDate()
        ).padStart(
            2,
            "0"
        );


    let counter =
        Number(
            localStorage.getItem(
                "nearMissCounter"
            )
        ) || 0;


    counter++;


    localStorage.setItem(
        "nearMissCounter",
        counter
    );


    return (
        "NM-" +
        year +
        month +
        day +
        "-" +
        String(counter).padStart(
            4,
            "0"
        )
    );

}


// =====================================================
// COMPRESS PHOTO
// =====================================================

function compressPhoto(file) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const img =
                        new Image();


                    img.onload =
                        function () {

                            let width =
                                img.width;

                            let height =
                                img.height;


                            // ---------------------------------
                            // RESIZE IMAGE
                            // ---------------------------------

                            if (
                                width >
                                    MAX_WIDTH ||
                                height >
                                    MAX_HEIGHT
                            ) {

                                const ratio =
                                    Math.min(
                                        MAX_WIDTH /
                                            width,
                                        MAX_HEIGHT /
                                            height
                                    );


                                width =
                                    Math.round(
                                        width *
                                        ratio
                                    );


                                height =
                                    Math.round(
                                        height *
                                        ratio
                                    );

                            }


                            // ---------------------------------
                            // CREATE CANVAS
                            // ---------------------------------

                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                width;


                            canvas.height =
                                height;


                            const context =
                                canvas.getContext(
                                    "2d"
                                );


                            context.drawImage(
                                img,
                                0,
                                0,
                                width,
                                height
                            );


                            // ---------------------------------
                            // COMPRESS JPEG
                            // ---------------------------------

                            const compressed =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    JPEG_QUALITY
                                );


                            resolve({

                                data:
                                    compressed
                                        .split(",")[1],

                                type:
                                    "image/jpeg",

                                name:
                                    "NearMiss_" +
                                    Date.now() +
                                    "_" +
                                    Math.random()
                                        .toString(36)
                                        .substring(
                                            2,
                                            8
                                        ) +
                                    ".jpg"

                            });

                        };


                    img.onerror =
                        function () {

                            reject(
                                new Error(
                                    "Unable to read image."
                                )
                            );

                        };


                    img.src =
                        event.target.result;

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Unable to read photo."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


// =====================================================
// READ VIDEO
// =====================================================

function readVideo(file) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    try {

                        const base64 =
                            event.target.result
                                .split(",")[1];


                        if (!base64) {

                            reject(
                                new Error(
                                    "Video data could not be read."
                                )
                            );

                            return;

                        }


                        resolve({

                            data:
                                base64,

                            type:
                                file.type ||
                                "video/mp4",

                            name:
                                "NearMiss_Video_" +
                                Date.now() +
                                "_" +
                                Math.random()
                                    .toString(36)
                                    .substring(
                                        2,
                                        8
                                    ) +
                                "_" +
                                file.name

                        });

                    }

                    catch (error) {

                        reject(
                            new Error(
                                "Unable to process video."
                            )
                        );

                    }

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Unable to read video."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


// =====================================================
// SUBMIT FORM
// =====================================================

if (!form) {

    console.error(
        "❌ ERROR: nearMissForm was not found."
    );

} else {

    console.log(
        "✅ nearMissForm found."
    );


    form.addEventListener(
        "submit",
        async function (event) {

            // ---------------------------------------------
            // STOP NORMAL HTML SUBMISSION
            // ---------------------------------------------

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "================================="
            );

            console.log(
                "SUBMIT EVENT DETECTED"
            );

            console.log(
                "================================="
            );


            // ---------------------------------------------
            // SUBMIT BUTTON
            // ---------------------------------------------

            const submitButton =
                form.querySelector(
                    ".submit-button"
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "SUBMITTING...";

            }


            // ---------------------------------------------
            // SHOW STATUS
            // ---------------------------------------------

            if (successMessage) {

                successMessage.style.display =
                    "block";

                successMessage.innerHTML =
                    "<strong>⏳ Preparing report...</strong>";

            }


            try {

                // =========================================
                // GENERATE REPORT NUMBER
                // =========================================

                const reportNumber =
                    generateReportNumber();


                console.log(
                    "Report Number:",
                    reportNumber
                );


                // =========================================
                // CHECK PHOTO INPUT
                // =========================================

                if (!photoInput) {

                    throw new Error(
                        "Photo input (#photo) was not found."
                    );

                }


                // =========================================
                // GET PHOTOS
                // =========================================

                let photos = [];


                const selectedFiles =
                    photoInput.files;


                console.log(
                    "Photos selected:",
                    selectedFiles.length
                );


                if (
                    selectedFiles.length >
                    MAX_PHOTOS
                ) {

                    throw new Error(
                        "Maximum 10 photos allowed."
                    );

                }


                // =========================================
                // PROCESS PHOTOS
                // =========================================

                for (
                    let i = 0;
                    i < selectedFiles.length;
                    i++
                ) {

                    const photo =
                        selectedFiles[i];


                    console.log(
                        "Processing photo:",
                        photo.name
                    );


                    if (
                        photo.size >
                        MAX_PHOTO_SIZE
                    ) {

                        throw new Error(
                            "Photo " +
                            (i + 1) +
                            " is larger than 10 MB."
                        );

                    }


                    if (successMessage) {

                        successMessage.innerHTML =
                            "<strong>📷 Processing photo " +
                            (i + 1) +
                            " of " +
                            selectedFiles.length +
                            "...</strong>";

                    }


                    const compressed =
                        await compressPhoto(
                            photo
                        );


                    photos.push({

                        photoData:
                            compressed.data,

                        photoName:
                            compressed.name,

                        photoType:
                            compressed.type

                    });

                }


                console.log(
                    "Photos processed:",
                    photos.length
                );


                // =========================================
                // GET VIDEO
                // =========================================

                let video = null;


                if (
                    videoInput &&
                    videoInput.files.length > 0
                ) {

                    const selectedVideo =
                        videoInput.files[0];


                    const videoSizeMB =
                        selectedVideo.size /
                        (1024 * 1024);


                    console.log(
                        "Video selected:",
                        selectedVideo.name
                    );


                    console.log(
                        "Video size:",
                        videoSizeMB.toFixed(2) +
                        " MB"
                    );


                    // -------------------------------------
                    // CHECK VIDEO SIZE
                    // -------------------------------------

                    if (
                        selectedVideo.size >
                        MAX_VIDEO_SIZE
                    ) {

                        throw new Error(
                            "Video is larger than 20 MB."
                        );

                    }


                    // -------------------------------------
                    // PROCESS VIDEO
                    // -------------------------------------

                    if (successMessage) {

                        successMessage.innerHTML =
                            "<strong>🎥 Processing video (" +
                            videoSizeMB.toFixed(1) +
                            " MB)...</strong>" +
                            "<br><br>" +
                            "Please wait. Do not close this page.";

                    }


                    video =
                        await readVideo(
                            selectedVideo
                        );


                    console.log(
                        "Video processed successfully."
                    );

                }


                // =========================================
                // GET FORM ELEMENTS
                // =========================================

                const locationElement =
                    document.getElementById(
                        "location"
                    );

                const departmentElement =
                    document.getElementById(
                        "department"
                    );

                const hazardCategoryElement =
                    document.getElementById(
                        "hazardCategory"
                    );

                const whatHappenedElement =
                    document.getElementById(
                        "whatHappened"
                    );

                const reporterNameElement =
                    document.getElementById(
                        "reporterName"
                    );


                // =========================================
                // CHECK REQUIRED ELEMENTS
                // =========================================

                if (!dateTime) {

                    throw new Error(
                        "Date/time field (#dateTime) was not found."
                    );

                }


                if (!locationElement) {

                    throw new Error(
                        "Location field (#location) was not found."
                    );

                }


                if (!departmentElement) {

                    throw new Error(
                        "Department field (#department) was not found."
                    );

                }


                if (!hazardCategoryElement) {

                    throw new Error(
                        "Hazard category field (#hazardCategory) was not found."
                    );

                }


                if (!whatHappenedElement) {

                    throw new Error(
                        "What happened field (#whatHappened) was not found."
                    );

                }


                if (!reporterNameElement) {

                    throw new Error(
                        "Reporter name field (#reporterName) was not found."
                    );

                }


                // =========================================
                // CREATE REPORT
                // =========================================

                const report = {

                    reportNumber:
                        reportNumber,

                    dateTime:
                        dateTime.value,

                    location:
                        locationElement.value,

                    department:
                        departmentElement.value,

                    hazardCategory:
                        hazardCategoryElement.value,

                    whatHappened:
                        whatHappenedElement.value,

                    reporterName:
                        reporterNameElement.value,

                    photos:
                        photos,

                    video:
                        video,

                    status:
                        "New",

                    submittedAt:
                        new Date().toISOString()

                };


                console.log(
                    "================================="
                );

                console.log(
                    "REPORT READY"
                );

                console.log(
                    "Photos:",
                    photos.length
                );

                console.log(
                    "Video:",
                    video
                        ? "YES"
                        : "NO"
                );

                console.log(
                    "================================="
                );


                // =========================================
                // SEND TO GOOGLE APPS SCRIPT
                // =========================================

                if (successMessage) {

                    successMessage.innerHTML =
                        "<strong>☁️ Sending report...</strong>" +
                        "<br><br>" +
                        "Please wait...";

                }


                console.log(
                    "Sending report to Google Apps Script..."
                );


                const response =
                    await fetch(
                        GOOGLE_SCRIPT_URL,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "text/plain;charset=utf-8"

                            },

                            body:
                                JSON.stringify(
                                    report
                                )

                        }
                    );


                console.log(
                    "SERVER STATUS:",
                    response.status
                );


                // =========================================
                // READ SERVER RESPONSE
                // =========================================

                const responseText =
                    await response.text();


                console.log(
                    "================================="
                );

                console.log(
                    "SERVER RESPONSE:"
                );

                console.log(
                    responseText
                );

                console.log(
                    "================================="
                );


                if (!responseText) {

                    throw new Error(
                        "Server returned an empty response."
                    );

                }


                // =========================================
                // PARSE JSON
                // =========================================

                let result;


                try {

                    result =
                        JSON.parse(
                            responseText
                        );

                }

                catch (jsonError) {

                    console.error(
                        "JSON PARSE ERROR:",
                        jsonError
                    );

                    throw new Error(
                        "Server did not return valid JSON. Check the Google Apps Script deployment."
                    );

                }


                console.log(
                    "PARSED RESULT:",
                    result
                );


                // =========================================
                // CHECK SERVER SUCCESS
                // =========================================

                if (
                    !result ||
                    result.success !== true
                ) {

                    throw new Error(
                        result &&
                        result.error
                            ? result.error
                            : "Report was not accepted by the server."
                    );

                }


                // =========================================
                // SUCCESS
                // =========================================

                if (successMessage) {

                    successMessage.innerHTML =
                        "<strong>✅ Report submitted successfully!</strong>" +
                        "<br><br>" +

                        "Report No: " +
                        "<strong>" +
                        reportNumber +
                        "</strong>" +

                        "<br><br>" +

                        "📷 Photos uploaded: " +
                        "<strong>" +
                        photos.length +
                        "</strong>" +

                        "<br><br>" +

                        "🎥 Video uploaded: " +
                        "<strong>" +
                        (
                            video
                                ? "Yes"
                                : "No"
                        ) +
                        "</strong>" +

                        "<br><br>" +

                        "Your report has been recorded.";

                }


                console.log(
                    "================================="
                );

                console.log(
                    "✅ REPORT SUBMITTED SUCCESSFULLY"
                );

                console.log(
                    "================================="
                );

            }


            // =============================================
            // ERROR
            // =============================================

            catch (error) {

                console.error(
                    "================================="
                );

                console.error(
                    "❌ SUBMISSION ERROR"
                );

                console.error(
                    error
                );

                console.error(
                    "================================="
                );


                if (successMessage) {

                    successMessage.innerHTML =
                        "<strong>❌ Unable to submit report.</strong>" +
                        "<br><br>" +
                        "<span style='color:#b00020;'>" +
                        error.message +
                        "</span>" +
                        "<br><br>" +
                        "Please try again.";

                }

            }


            // =============================================
            // ENABLE BUTTON
            // =============================================

            finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "SUBMIT NEAR MISS";

                }

            }

        }
    );

}
