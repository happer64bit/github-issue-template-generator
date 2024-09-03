import { createStore } from "solid-js/store";
import { createEffect, For, Show } from "solid-js";
import type { Component } from "solid-js";
import PlusIcon from "lucide-solid/icons/plus";
import Header from "./components/Header";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import Textarea from "./components/ui/Textarea";
import Select from "./components/ui/Select";
import { stringify } from 'yaml';
import 'prismjs'
import { Highlight } from "solid-highlight";

import 'solid-devtools';
import '@jongwooo/prism-theme-github/themes/prism-github-default-auto.min.css';
import "prismjs/components/prism-yaml";

interface Section {
  type: "Markdown" | "Textarea" | "Input" | "Dropdown" | "Checkboxes";
  label?: string;
  description?: string;
  placeholder?: string;
  value?: string;
  options?: string[];
  multiple?: boolean;
  required?: boolean;
  render?: string;
}

const App: Component = () => {
  const [store, setStore] = createStore({
    name: "",
    title: "",
    description: "",
    sections: [{ type: "Markdown", value: "" }] as Section[],
    yamlOutput: "",
  });

  const addSection = () => {
    setStore("sections", [...store.sections, { type: "Markdown", value: "" }]);
  };

  const handleChange = (index: number, key: keyof Section, value: string | any) => {
    setStore("sections", index, (prevSection) => ({ ...prevSection, [key]: value }));
  };

  const generateYaml = () => {
    const topFields = {
      name: store.name,
      title: store.title,
      description: store.description,
    };

    const formData = store.sections.map((section) => {
      const result: any = { type: section.type.toLowerCase() };
      if (section.type !== "Markdown") {
        result.id = section.type.toLowerCase().replace(/ /g, '-');
        result.attributes = { ...section };
        if (section.type === "Dropdown" && section.options) {
          result.attributes.default = 0;
        }
      } else {
        result.attributes = { value: section.value };
      }
      return result;
    });

    return stringify({ ...topFields, body: formData });
  };

  createEffect(() => {
    setStore("yamlOutput", generateYaml());
  });

  return (
    <>
      <Header />
      <div class="container">
        <div class="grid md:grid-cols-2 gap-10">
          <div class="space-y-4 my-4">
            {["name", "title", "description"].map((field: string) => (
              <div class="space-y-1">
                <label for={`${field}-input`} class="text-sm capitalize">{field}</label>
                {field === "description" ? (
                  <Textarea
                    id={`${field}-input`}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    rows={4}
                    class="w-full"
                    value={store[field] as string}
                    onInput={(e) => setStore(field, e.currentTarget.value)}
                  />
                ) : (
                  <Input
                    id={`${field}-input`}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    class="w-full"
                    //@ts-ignore
                    value={store[field] as string}
                    onInput={(e) => setStore(field as any, e.currentTarget.value)}
                  />
                )}
              </div>
            ))}
            <div>
              <h2 class="text-lg">Body</h2>
              <div class="space-y-2 divide-y-[1px]">
                <For each={store.sections}>
                  {(section, index) => (
                    <div class="space-y-3">
                      <Select
                        class="block my-4"
                        value={section.type}
                        onInput={(e) => handleChange(index(), "type", e.currentTarget.value as Section["type"])}
                      >
                        {["Markdown", "Textarea", "Input", "Dropdown", "Checkboxes"].map(type => (
                          <option value={type}>{type}</option>
                        ))}
                      </Select>
                      <div class="space-y-2">
                        <Show when={section.type !== "Markdown"}>
                          <Input
                            class="w-full block"
                            placeholder="Enter label"
                            value={section.label || ""}
                            onInput={(e) => handleChange(index(), "label", e.currentTarget.value)}
                          />
                          <Input
                            class="w-full block"
                            placeholder="Enter description"
                            value={section.description || ""}
                            onInput={(e) => handleChange(index(), "description", e.currentTarget.value)}
                          />
                          {section.type === "Input" && (
                            <>
                              <Input
                                class="w-full block"
                                placeholder="Enter placeholder"
                                value={section.placeholder || ""}
                                onInput={(e) => handleChange(index(), "placeholder", e.currentTarget.value)}
                              />
                              <Input
                                class="w-full block"
                                placeholder="Enter value"
                                value={section.value || ""}
                                onInput={(e) => handleChange(index(), "value", e.currentTarget.value)}
                              />
                            </>
                          )}
                          {section.type === "Textarea" && (
                            <Textarea
                              rows={3}
                              class="w-full block"
                              placeholder="Enter text"
                              value={section.value || ""}
                              onInput={(e) => handleChange(index(), "value", e.currentTarget.value)}
                            />
                          )}
                          {section.type === "Dropdown" && (
                            <Input
                              class="w-full block"
                              placeholder="Enter options"
                              value={section.options?.join(", ") || ""}
                              onInput={(e) => handleChange(index(), "options", e.currentTarget.value.split(", "))}
                            />
                          )}
                          {section.type === "Checkboxes" && (
                            <Input
                              class="w-full block"
                              placeholder="Enter options"
                              value={section.options?.join(", ") || ""}
                              onInput={(e) => handleChange(index(), "options", e.currentTarget.value.split(", "))}
                            />
                          )}
                        </Show>
                        {section.type === "Markdown" && (
                          <Textarea
                            rows={3}
                            class="w-full block"
                            placeholder="Enter markdown content"
                            value={section.value || ""}
                            onInput={(e) => handleChange(index(), "value", e.currentTarget.value)}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </For>
                <div class="flex justify-end my-6">
                  <Button
                    variety="primary"
                    class="flex gap-1 py-1.5 items-center"
                    onClick={addSection}
                  >
                    <PlusIcon size={14} />
                    Add Section
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Highlight language="yaml">
              {store.yamlOutput}
            </Highlight>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
