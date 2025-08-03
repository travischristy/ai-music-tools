from pydantic import BaseModel
from typing import List, Literal, Union

# 3.0 Creative Workflows (The "Chimera" Engine)

class BaseWorkflow(BaseModel):
    name: str
    description: str
    use_case: str

# 3.1 The Semantic Core
class Aporia(BaseWorkflow):
    name: str = "Aporia & Rhetorical Doubt"
    description: str = "Expresses real or feigned doubt to build tension or frame a powerful argument."
    use_case: str = "Crafting introspective verses that pose questions answered powerfully in the chorus."

class Antanaclasis(BaseWorkflow):
    name: str = "Antanaclasis & Polysemy"
    description: str = "Repeats a single word with a different meaning each time for witty, dense, and layered wordplay."
    use_case: str = "Creating a clever hook or a profound line that makes the listener re-evaluate a concept."

class Chiasmus(BaseWorkflow):
    name: str = "Chiasmus & Inverted Parallelism"
    description: str = "Creates a balanced, symmetrical \"ABBA\" structure of ideas to deliver a memorable, philosophical statement."
    use_case: str = "Writing a powerful, conclusive bridge or final line that feels both profound and complete."

# 3.2 Lyrical Auteurship
class LeonardCohenModel(BaseWorkflow):
    name: str = "Leonard Cohen Model"
    description: str = "Generates ambiguous lyrics by fusing sacred and profane imagery, resisting a single interpretation."
    use_case: str = "Writing lyrics with deep, multi-layered meaning that invite listener interpretation."

class TomWaitsModel(BaseWorkflow):
    name: str = "Tom Waits Model"
    description: str = "Writes from the first-person perspective of a specific, gritty, and often marginalized character persona."
    use_case: str = "Creating authentic, story-driven lyrics with a strong, consistent character voice."

class KendrickLamarModel(BaseWorkflow):
    name: str = "Kendrick Lamar Model"
    description: str = "Employs rapid perspective shifts within a single song and blends the typical functions of song sections (e.g., a narrative chorus)."
    use_case: str = "Exploring a complex, multi-faceted theme from different viewpoints within the same song."

# 3.3 The Generative Muse
class DaliMethod(BaseWorkflow):
    name: str = "Dalí's Paranoiac-Critical Method"
    description: str = "Describes a core subject through the imagery and vocabulary of a completely unrelated concept or \"lens.\""
    use_case: str = "Generating highly original, surreal, and dream-like metaphors that are guaranteed to be non-cliché."

class CutUpTechnique(BaseWorkflow):
    name: str = "The Cut-Up Technique (Burroughs/Bowie)"
    description: str = "Fragments and randomly reassembles a source text to create unexpected juxtapositions and novel lyrical ideas."
    use_case: str = "Overcoming writer's block by generating surprising new source material from existing text."

class CreativeSabotage(BaseWorkflow):
    name: str = "Creative Sabotage (Constraint-Based)"
    description: str = "Applies a strict, arbitrary rule to a draft (e.g., \"remove the letter 'e',\" \"invert the core emotion\") to force a radical and innovative revision."
    use_case: str = "Forcing a radical and innovative revision of an existing draft."

# 3.4 Psycho-Acoustic Engine
class HuronITPRAModel(BaseWorkflow):
    name: str = "The Huron ITPRA Model"
    description: str = "Engineers an emotional journey by intentionally manipulating the listener's expectations of melody and harmony."
    use_case: str = "Structuring the lyrical and implied musical arc of a song to maximize emotional impact."


# Union type for all possible workflows
AnyWorkflow = Union[Aporia, Antanaclasis, Chiasmus, LeonardCohenModel, TomWaitsModel, KendrickLamarModel, DaliMethod, CutUpTechnique, CreativeSabotage, HuronITPRAModel]

# Main request model for the API
class GenerationRequest(BaseModel):
    goal: Literal['Generate New Lyrics', 'Revise Existing Lyrics']
    workflows: List[AnyWorkflow]
    # ... other fields from the spec will be added here later
