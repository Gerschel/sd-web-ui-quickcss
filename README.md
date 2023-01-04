# sd-web-ui-quickcss

## Creating sheets
Dynamic branch merged with master branch. It can now autogenerate sliders and colorpickers, and has a save feature.  
It takes a particular way of setting up.  

Here's how it works.  

When you click to apply a sheet, it will copy the sheet from the choices directory, and save it with a name the webui looks for by default. 
It will not replace `user.css`, it saves it as `extensions/sd-webui-quickcss/style.css`.  
quickcss is one of the last styles to be applied, because of sort order, then `user.css` gets applied.
This is a design choice for accessibility, so users can use their `user.css` to overrule for things they need it be be (contrast, font, size, etc.)
This means, you don't need to use `!important` as much as you think you do, you just need to increase specificity.  
 
A soft restart will refresh the interface with the new sheet.  
During boot, it will also scrape through the sheet looking for a few things, so it knows what and how many to generate.  
If the trigger words are not available, it wont create adjusters.  
There are three keywords used for it's seek.  

![image](https://user-images.githubusercontent.com/9631031/210469201-c974a33e-c87d-49bf-a439-a90fedb0e397.png)

One of the words is `quickcss_target`. This will make it begin reading the next line to be a colorpicker.  
It will continue reading for colorpicker adjusters, until it finds the next keyword. `/*ENDCOLORPICKERS*/`
Then it will start to read the next line as if it's an integer for generating sliders.  
It will stop reading at `/*BREAKFILEREADER*/`  
During read, it stores these positions to use for saving.  

It will save using the same format.  
A single line for the targets, i.e- `root, *, quickcss_target{`, so PUT YOUR TARGETS ON SINGLE LINE for this section.
Then `--variable_name:  value;`, the keyord flags, and any rule not used inside the block.
These extra rules are not read from file, but they are rewritten to file, since javascript hands me the full rule. This means extra comments will be deleted.

Makes sense so far right. It needs to identify markers so it could work with more than one sized sheet.

During the line read, it will expect a certain format. Extra comments, blank lines will break this. I had a blank line pluck, but to save properly, I would have to store their location, since the save does not edit the entire block, it edits the changed lines and writes all back, if I don't track blank lines, it will lead to bugs, like extra variables and writing END*** in the wrong spot.

For colorpickers, it will strip the blank space before and after, split the left and right half on the colon `:`.  
The right half will be treated like a hex code, it will strip the semi-colon and extra blank space.  
The left half will be used as the text for the component.  
It will do it by stripping off the double tack `--`, convert underscores to spaces, the capitalize like a title.  
`--button_border_color` becomes `Button Border Color`  
`--inactive_tab: #555;` works
`--inactive_tab: rgb(50 50 50);` does NOT work

For range sliders, it will treat the names the same way, it will expect an integer without units.  
`--box_shadow_transparency: 100;` works
`--border_thickness: 2px;` does NOT work  

To make this integer value have a unit, in your css, use the `calc()` function.  
```css
rule{
  border-radius: calc( 1px * var(--tab_border_radius_top));
}
```  

The default colorpickers in gradio do not have an alpha channel I have not tested this, but it should work, with limitations unless you get creative with math.  This should work with double digit integers in the slider.
```css
rule{
  background-color: var(--rule_color)var(--rule_transparency);
}
```

Opacity is an alternative you can use, but it will affect more than just the color. Currently, all range sliders are created with a minimum of 0, and max of 100, with steps of 1. You can use `calc()` to make it a decimal value between 0 and 1.  
```css
calc( 0.01 * var(--my_int))
``` 

If you really need more fine grained control, you can use several sliders, just make sure to do the math so it's range goes from 0 to 255.
```css
rgba(calc(2.55 * var(--background_red_value)) calc(25.5 * var(--background_blue_value)) calc(25.5 * var(--background_green_value)) calc(25.5 * var(--background_alpha_val))
```  
You can store it in a variable too. Just put it outside the read zone.

Going back to saving, when it saves, it will overwrite the `style.css` copy, so it's ready to load when it boots up, and it saves it with the filename in the `style_choices` directory, for later reapplying.  

There's a reason the button and save as field is hidden, if a person tries to save while the javascript has not done a fetch and replace on the styles, the backend list will be empty. This would cause it to mangle the file.

## Old info, relevant enough
UPDATE Has save feature
UPDATE modified example to work with dynamic
UPDATE dynamically generate sliders and colopickers depending on sheet
UPDATE 2022/12/19: Now has local imports, technically it downloads too.

I just setup a quick css apply using the style here https://github.com/AUTOMATIC1111/stable-diffusion-webui/discussions/5813

Theme and images included are from that discussion. They are not my work. I just made the tool for them to play with their work.
## Installation
Now you can install from inside the webui in the extensions tab. Just refresh. Optionally put this url in the install from url section.
https://github.com/Gerschel/sd-web-ui-quickcss

Put different css files in style_choices folder in extension (might create a copy to folder from filepath)
Put different logos (png format) in logos folder in extensions directory.
Put different favicons (svg format) in favicons directory.
It's that easy.
If you have a `user.css` it will take precedence over style.css if they have matching elements.
![image](https://user-images.githubusercontent.com/9631031/208538335-d1da51c8-33d5-4f28-b2e6-0083f0a7005d.png)

## Ugly Demo
![image](https://user-images.githubusercontent.com/9631031/210470845-3c0c1b3b-821d-4c22-87f4-6c193cd3e3f4.png)

