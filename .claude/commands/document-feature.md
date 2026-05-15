# Document Feature Command

Generate technical documentation and final user documentation from the   : $ARGUMENTS

## Review documentation examples
- For now the team don't have specific documentation to follow like a template

## Process
1. **First** : Analyze the relevant code files
2. **Second** : Create detailed technical documentation covering:
    - A brief description of the external libraries used by the component
    - A description of the classes and interfaces used in the component
    - An explanation of the technical component flow
    - A description of the API endpoint on which the component interact and an example of API request
    
3. **Third** : Create detailed final user documentation covering:
    - Generate simple guide with screenshots placeholders, step-by-step instructions
    - Capture and insert screenshots in user-facing documentation
4. **Fourth** : Classify the component if is a backend, frontend or fullstack component
    
## Output Requirements
- Generate technical documentation file in the path : 
    - For backend : docs/dev/backend/{component_name}-implementation.md
    - For frontend : docs/dev/frontend/{component_name}-implementation.md
    - For fullstack : docs/dev/fullstack/{component_name}-implementation.md
- Generate detailed final user documentation file in the path : docs/user/how-to-{component_name}.md
- Create a cross-reference between docs/dev/{component_name}-implementation.md and docs/dev/how-to-{component_name}.md

## Review Checklist
- TO-DO