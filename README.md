# gulp-sprite-datauri
Gulp task to convert images to sass variables in datauri format

Based on Davemo's (https://github.com/davemo) brilliant grunt plugin but rebuilt from the ground up for gulp.

Feed in images and this creates a .scss file with variables for each image.

    return gulp.src('sprite/*.+(jpeg|jpg|png|gif|svg)')
        .pipe(
            gulpSpriteDatauri({
                fileName: '_sprites.scss'
            })
        )
        .pipe(gulp.dest('sass/partials'));

If you want to autogenerate different colored SVGs you can also pass in an object called colors. To apply them add .colors to the end of your filename followed by a hyphen-seperated list of color names (which should match up to the colors in your gulpfile). Eg. 'myicon.colors-white-blue.svg' will generate variables for the original color and then also a version where all colors had been replaced with white, and one where all colors have been replaced with blue.

    return gulp.src('sprite/*.+(jpeg|jpg|png|gif|svg)')
        .pipe(
            gulpSpriteDatauri({
                fileName: '_sprites.scss',
                colors: {
                    white: '#ffffff',
                    blue: '#0000ff'
                }
            })
        )
        .pipe(gulp.dest('sass/partials'));