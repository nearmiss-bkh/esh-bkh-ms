```javascript
// =====================================================
// SCRIPT.JS LOADING TEST
// =====================================================

alert("SCRIPT.JS IS WORKING");


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


// =====================================================
// GOOGLE APPS SCRIPT URL
// =====================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyvYdD4VfoUM-vD5yS2AdJ_vCSNOU3TE6qY1J9ZIqFHqndGF-a_LXbX0GDmmU3A5VRrIw/exec";


// =====================================================
// PHOTO SETTINGS
// =====================================================

const MAX_PHOTOS = 10;

const MAX_PHOTO_SIZE =
    10 * 1024 * 1024;

const MAX_WIDTH = 1200;

const MAX_HEIGHT = 1200;

const JPEG_QUALITY = 0.75;


// =====================================================
// CHECK FORM
// =====================================================

if (!form) {

    alert(
        "ERROR: nearMissForm NOT FOUND"
    );

} else {

    console.log(
        "nearMissForm found"
    );

}


// =====================================================
// CHECK GOOGLE SCRIPT URL
// =====================================================

console.log(
    "Google Apps Script URL:",
    GOOGLE_SCRIPT_URL
);


// =====================================================
// AUTO MALAYSIA DATE & TIME
// =====================================================

function setDateTime() {

    if (!dateTime) {
        return;
    }


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


    const hour =
        String(
            malaysiaTime.getHours()
        ).padStart(
            2,
            "0"
        );


    const minute =
        String(
            malaysiaTime.getMinutes()
        ).padStart(
            2,
            "0"
        );


    dateTime.value =
        year +
        "-" +
        month +
        "-" +
        day +
        "T" +
        hour +
        ":" +
        minute;

}


setDateTime();


setInterval(
    setDateTime,
    60000
);


// =====================================================
// PHOTO COUNTER
// =====================================================

if (photoInput) {

    photoInput.addEventListener(
        "change",
        function () {

            const count =
                photoInput.files.length;


            if (count === 0) {

                photoCount.textContent =
                    "No photos selected";

            } else if (
                count > MAX_PHOTOS
            ) {

                photoCount.textContent =
                    "❌ Maximum 10 photos allowed";

            } else {

                photoCount.textContent =
                    "📷 " +
                    count +
                    " photo(s) selected";

            }

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
        function (resolve, reject) {

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


                            const compressed =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    JPEG_QUALITY
                                );


                            resolve({

                                data:
                                    compressed.split(
                                        ","
                                    )[1],

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


            reader.readAsDataURL(file);

        }
    );

}


// =====================================================
// FORM SUBMIT
// =====================================================

if (form) {

    form.addEventListener(
        "submit",
        async function (event) {

            // STOP NORMAL FORM SUBMISSION

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "SUBMIT EVENT DETECTED"
            );


            alert(
                "SUBMIT EVENT DETECTED"
            );


            // =============================================
            // BUTTON
            // =============================================

            const submitButton =
                form.querySelector(
                    ".submit-button"
                );


            submitButton.disabled =
                true;


            submitButton.textContent =
                "SUBMITTING...";


            successMessage.style.display =
                "block";


            successMessage.innerHTML =
                "<strong>⏳ Preparing report...</strong>";


            try {

                // =========================================
                // REPORT NUMBER
                // =========================================

                const reportNumber =
                    generateReportNumber();


                // =========================================
                // PHOTOS
                // =========================================

                let photos = [];


                const selectedFiles =
                    photoInput.files;


                console.log(
                    "Photos:",
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


                    successMessage.innerHTML =
                        "<strong>📷 Processing photo " +
                        (i + 1) +
                        " of " +
                        selectedFiles.length +
                        "...</strong>";


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


                // =========================================
                // CREATE REPORT
                // =========================================

                const report = {

                    reportNumber:
                        reportNumber,

                    dateTime:
                        dateTime.value,

                    location:
                        document.getElementById(
                            "location"
                        ).value,

                    department:
                        document.getElementById(
                            "department"
                        ).value,

                    hazardCategory:
                        document.getElementById(
                            "hazardCategory"
                        ).value,

                    whatHappened:
                        document.getElementById(
                            "whatHappened"
                        ).value,

                    reporterName:
                        document.getElementById(
                            "reporterName"
                        ).value,

                    photos:
                        photos,

                    status:
                        "New",

                    submittedAt:
                        new Date().toISOString()

                };


                console.log(
                    "REPORT:",
                    report
                );


                // =========================================
                // SEND
                // =========================================

                successMessage.innerHTML =
                    "<strong>☁️ Sending report...</strong>";


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
                    "HTTP STATUS:",
                    response.status
                );


                // =========================================
                // RESPONSE
                // =========================================

                const responseText =
                    await response.text();


                console.log(
                    "SERVER RESPONSE:",
                    responseText
                );


                let result;


                try {

                    result =
                        JSON.parse(
                            responseText
                        );

                } catch (error) {

                    throw new Error(
                        "Server returned invalid response."
                    );

                }


                // =========================================
                // SUCCESS CHECK
                // =========================================

                if (
                    !result ||
                    result.success !== true
                ) {

                    throw new Error(
                        result.error ||
                        "Report was not accepted."
                    );

                }


                // =========================================
                // SUCCESS
                // =========================================

                successMessage.innerHTML =
                    "<strong>✅ Report submitted successfully!</strong>" +
                    "<br><br>" +
                    "Report No: <strong>" +
                    reportNumber +
                    "</strong>" +
                    "<br><br>" +
                    "📷 Photos uploaded: <strong>" +
                    photos.length +
                    "</strong>";


                console.log(
                    "REPORT SUBMITTED SUCCESSFULLY"
                );

            }


            // =========================================
            // ERROR
            // =========================================

            catch (error) {

                console.error(
                    "SUBMISSION ERROR:",
                    error
                );


                successMessage.innerHTML =
                    "<strong>❌ Unable to submit report.</strong>" +
                    "<br><br>" +
                    error.message;

            }


            // =========================================
            // ENABLE BUTTON
            // =========================================

            finally {

                submitButton.disabled =
                    false;


                submitButton.textContent =
                    "SUBMIT NEAR MISS";

            }

        }
    );

}
```
