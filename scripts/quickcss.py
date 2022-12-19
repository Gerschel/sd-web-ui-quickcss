import gradio as gr
import modules.scripts as scripts
from modules import script_callbacks, shared
from os import listdir, path, remove
import shutil
from pathlib import Path

basedir = scripts.basedir()


class MyTab():
    
    def __init__(self, basedir):
        self.extensiondir = basedir
        self.webui_dir = Path(self.extensiondir).parents[1]
        print(self.webui_dir)


        self.style_folder = path.join(basedir, "style_choices") 
        self.logos_folder = path.join(self.extensiondir, "logos")
        self.favicon_folder = path.join(self.extensiondir, "favicons")

        self.styles_list = []
        self.logos_list = []
        self.favicon_list = []

        self.get_styles()
        self.get_logos()
        self.get_favicons()

        self.styles_dropdown = gr.Dropdown(label="Styles", render=False, interactive=True, choices=self.styles_list, type="value")
        self.logos_dropdown = gr.Dropdown(label="Logos", render=False, interactive=True, choices=self.logos_list, type="value")
        self.favicon_dropdown = gr.Dropdown(label="Favicon", render=False, interactive=True, choices=self.favicon_list, type="value")
        
        self.apply_style_bttn = gr.Button(value="Apply Style", render=False)
        self.apply_logo_bttn = gr.Button(value="Apply Logo", render=False)
        self.apply_favicon_bttn = gr.Button(value="Apply Favicon", render=False)

        self.logo_image = gr.Image(render=False)
        self.favicon_image = gr.Image(render=False)


        self.restart_bttn = gr.Button(value="Soft Restart to see affects", render=False, variant="primary")

        self.remove_style = gr.Button(value="Remove Style", render=False)

    def ui(self, *args, **kwargs):
        with gr.Blocks(analytics_enabled=False) as ui:
            with gr.Row():
                with gr.Column():
                    self.styles_dropdown.render()
                    self.apply_style_bttn.render()
                with gr.Column():
                    self.logos_dropdown.render()
                    self.apply_logo_bttn.render()
                with gr.Column():
                    self.favicon_dropdown.render()
                    self.apply_favicon_bttn.render()

            with gr.Row():
                self.restart_bttn.render()
                self.remove_style.render()
            
            with gr.Row():
                self.logo_image.render()
                self.favicon_image.render()

            # Handlers

            # Dropdown change

            self.logos_dropdown.change(
                fn = lambda x: self.get_image(x, folder = "logos"), 
                inputs = self.logos_dropdown,
                outputs = self.logo_image
            )

            self.favicon_dropdown.change(
                fn = lambda x: self.get_image(x, folder = "favicons"), 
                inputs = self.favicon_dropdown,
                outputs = self.favicon_image
            )


            self.apply_style_bttn.click(
                fn = lambda x: self.apply_style(x),
                inputs = self.styles_dropdown
            )

            self.apply_logo_bttn.click(
                fn = lambda x: self.apply_logo(x),
                inputs = self.logos_dropdown
            )

            self.apply_favicon_bttn.click(
                fn = lambda x: self.apply_favicon(x),
                inputs = self.logos_dropdown
            )


            self.remove_style.click(
                fn = lambda: self.delete_style()
            )

            self.restart_bttn.click(fn=self.local_request_restart, _js='restart_reload', inputs=[], outputs=[])


        return [(ui, "CSS App", "css app")]

    def get_styles(self):
        self.styles_list = [file_name for file_name in listdir(self.style_folder) if path.isfile(path.join(self.style_folder, file_name))] 

    def get_logos(self):
        self.logos_list = [file_name for file_name in listdir(self.logos_folder) if path.isfile(path.join(self.logos_folder,file_name))] 

    def get_favicons(self):
        self.favicon_list = [file_name for file_name in listdir(self.favicon_folder) if path.isfile(path.join(self.favicon_folder,file_name))] 


    def apply_style(self, selection):
        shutil.copy(path.join(self.style_folder, selection), path.join(self.extensiondir, "style.css"))

    def apply_logo(self, selection):
        shutil.copy(path.join(self.logos_folder, selection), path.join(self.webui_dir, "logo.png"))
 
    def apply_favicon(self, selection):
        shutil.copy(path.join(self.favicon_folder, selection), path.join(self.webui_dir, "favicon.svg"))

    def get_image(self, name, folder):
        return path.join(self.extensiondir, folder, name)

    
    def delete_style(self):
        try:
            remove(path.join(self.extensiondir, "style.css"))
        except FileNotFoundError:
            pass

    def local_request_restart(self):
        "Restart button"
        shared.state.interrupt()
        shared.state.need_restart = True


tab = MyTab(basedir)        
script_callbacks.on_ui_tabs(tab.ui)
