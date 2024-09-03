import { createEffect, createSignal, For, Show } from "solid-js";
import type { Component } from "solid-js";
import PlusIcon from "lucide-solid/icons/plus";
import Header from "./components/Header";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import Textarea from "./components/ui/Textarea";
import Select from "./components/ui/Select";
import { stringify } from 'yaml';
import CodeBlock from "./components/CodeBlock";

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
  // Signals for the top fields
  const [name, setName] = createSignal<string>("");
  const [title, setTitle] = createSignal<string>("");
  const [description, setDescription] = createSignal<string>("");

  const [sections, setSections] = createSignal<Section[]>([{ type: "Markdown", value: "" }]);
  const [yamlOutput, setYamlOutput] = createSignal<string>("");

  const addSection = () => {
    setSections([...sections(), { type: "Markdown", value: "" }]);
  };

  const handleChange = (index: number, key: keyof Section, value: string | any) => {
    setSections(sections().map((section, i) =>
      i === index ? { ...section, [key]: value } : section
    ));
  };

  const generateYaml = () => {
    // Define top-level fields
    const topFields = {
      name: name(),
      title: title(),
      description: description(),
    };

    // Define sections
    const formData = sections().map((section) => {
      const result: any = { type: section.type.toLowerCase() };

      if (section.type !== "Markdown") {
        result.id = section.type.toLowerCase().replace(/ /g, '-'); // Generate an ID for each section
        result.attributes = {};

        if (section.label) result.attributes.label = section.label;
        if (section.description) result.attributes.description = section.description;
        if (section.placeholder) result.attributes.placeholder = section.placeholder;
        if (section.options) result.attributes.options = section.options;
        if (section.multiple) result.attributes.multiple = section.multiple;
        if (section.required) result.validations = { required: section.required };
        if (section.render) result.attributes.render = section.render;

        // Special handling for Dropdown to include a default value
        if (section.type === "Dropdown" && section.options) {
          result.attributes.default = 0; // Set default to 0 if needed
        }
      } else {
        result.attributes = { value: section.value };
      }

      return result;
    });

    // Combine top fields and form data
    const yamlObject = { ...topFields, body: formData };

    // Generate YAML string
    const yamlString = stringify(yamlObject);
    setYamlOutput(yamlString);
  };

  createEffect(() => {
    generateYaml(); // Automatically generate YAML when sections or top fields change
  }, [name, title, description, sections]);

  return (
    <>
      <Header />
      <div class="container">
        <div class="grid grid-cols-2 gap-10">
          <div class="space-y-4 my-4">
            <div class="space-y-1">
              <label for="name-input" class="text-sm">Name</label>
              <Input
                id="name-input"
                placeholder="Name"
                class="w-full"
                value={name()}
                onInput={(e) => setName(e.currentTarget.value)}
              />
            </div>
            <div class="space-y-1">
              <label for="title-input" class="text-sm">Title</label>
              <Input
                id="title-input"
                placeholder="Title"
                class="w-full"
                value={title()}
                onInput={(e) => setTitle(e.currentTarget.value)}
              />
            </div>
            <div class="space-y-1">
              <label for="description-input" class="text-sm">Description</label>
              <Textarea
                rows={4}
                id="description-input"
                placeholder="Description"
                class="w-full"
                value={description()}
                onInput={(e) => setDescription(e.currentTarget.value)}
              />
            </div>
            <div>
              <h2 class="text-lg">Body</h2>
              <div class="space-y-2">
                <div class="space-y-2 divide-y-[1px]">
                  <For each={sections()}>
                    {(section, index) => (
                      <div class="space-y-3">
                        <Select
                          class="block my-4"
                          value={section.type}
                          onChange={(e) => handleChange(index(), "type", e.currentTarget.value as Section["type"])}
                        >
                          <option value="Markdown">Markdown</option>
                          <option value="Textarea">Textarea</option>
                          <option value="Input">Input</option>
                          <option value="Dropdown">Dropdown</option>
                          <option value="Checkboxes">Checkboxes</option>
                        </Select>
                        <div class="space-y-2">
                          <Show when={section.type !== "Markdown"} keyed>
                            <>
                              <label class="text-sm">Label</label>
                              <Input
                                class="w-full block"
                                placeholder="Enter label"
                                value={section.label || ""}
                                onChange={(e) => handleChange(index(), "label", e.currentTarget.value)}
                              />
                              <label class="text-sm">Description</label>
                              <Input
                                class="w-full block"
                                placeholder="Enter description"
                                value={section.description || ""}
                                onChange={(e) => handleChange(index(), "description", e.currentTarget.value)}
                              />
                            </>
                          </Show>

                          <Show when={section.type === "Input"} keyed>
                            <>
                              <label class="text-sm">Placeholder</label>
                              <Input
                                class="w-full block"
                                placeholder="Enter placeholder"
                                value={section.placeholder || ""}
                                onChange={(e) => handleChange(index(), "placeholder", e.currentTarget.value)}
                              />
                              <label class="text-sm">Value</label>
                              <Input
                                class="w-full block"
                                placeholder="Enter value"
                                value={section.value || ""}
                                onChange={(e) => handleChange(index(), "value", e.currentTarget.value)}
                              />
                            </>
                          </Show>

                          <Show when={section.type === "Textarea"} keyed>
                            <>
                              <label class="text-sm">Value</label>
                              <Textarea
                                rows={3}
                                class="w-full block"
                                placeholder="Enter text"
                                value={section.value || ""}
                                onChange={(e) => handleChange(index(), "value", e.currentTarget.value)}
                              />
                            </>
                          </Show>

                          <Show when={section.type === "Dropdown"} keyed>
                            <>
                              <label class="text-sm">Options (comma-separated)</label>
                              <Input
                                class="w-full block"
                                placeholder="Enter options"
                                value={section.options?.join(", ") || ""}
                                onChange={(e) => handleChange(index(), "options", e.currentTarget.value.split(", "))}
                              />
                            </>
                          </Show>

                          <Show when={section.type === "Checkboxes"} keyed>
                            <>
                              <label class="text-sm">Options (comma-separated)</label>
                              <Input
                                class="w-full block"
                                placeholder="Enter options"
                                value={section.options?.join(", ") || ""}
                                onChange={(e) => handleChange(index(), "options", e.currentTarget.value.split(", "))}
                              />
                            </>
                          </Show>

                          <Show when={section.type === "Markdown"} keyed>
                            <>
                              <Textarea
                                rows={3}
                                class="w-full block"
                                placeholder="Enter markdown content"
                                value={section.value || ""}
                                onChange={(e) => handleChange(index(), "value", e.currentTarget.value)}
                              />
                            </>
                          </Show>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
                <div class="flex justify-end mt-4">
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
            <CodeBlock code={yamlOutput()}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
