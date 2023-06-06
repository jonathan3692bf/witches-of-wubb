import useGrimoire from '~/hooks/use-grimoire';
import { getBackgroundColorFromType } from '~/lib/utils';

export default function RecipeBox() {
  // const { queuedClips, playingClips, stoppingClips } = useContext(AbletonContext);
  // const { logger } = useContext(LoggerContext);
  // console.log('spell receipe', spellRecipe);
  const { spellRecipe, generateNewSpell, spellName } = useGrimoire();

  return (
    <div id='inner_recipe_box' className='max-w-full mt-[140px]'>
      <div id='recipe-bg' className='h-[23vh] w-full max-h-full mx-auto bg-recipe-bg'>
        <div id='recipe-header' className='h-[80px] grid grid-cols-3'>
          <div
            id='title'
            className='flex items-center stroke-black justify-center gap-6 col-start-2 text-xl -top-[20px] align-top font-fondamento'
          >
            Suggested Recipe: {spellName}
          </div>
          <div id='new-spell' className='float-right'>
            <button
              id='new-spell-btn'
              style={{ backgroundImage: `url(/images/new-spell.gif)` }}
              className='bg-cover h-[100px] w-[100px] stroke-black font-fondamento text-white py-2 px-4 rounded transition duration-200 ease-in-out hover:bg-opacity-50 float-right mr-8 mt-3'
              onClick={generateNewSpell}
            ></button>
          </div>
        </div>
        <div id='ingredients_contianer' className='grid grid-cols-4 text-center align-top'>
          {Object.entries(spellRecipe).map(([type, recipe]) => {
            return recipe ? (
              <div
                id={`ingredient-${recipe.rfid}-${type}`}
                className='relative -top-[80px] scale-50'
                key={recipe.rfid}
              >
                <div
                  id='color-blur'
                  className={`absolute inset-0 rounded-lg blur-xl z-0 ${getBackgroundColorFromType(
                    type,
                  )}`}
                ></div>
                <img
                  className='relative flex mt-3 scale-75'
                  src={`/ingredients/${recipe?.assetName}`}
                  alt={recipe.ingredientName}
                ></img>
                <div
                  id={`ingredient-${recipe.ingredientName}-label`}
                  className='mt-3 relative text-xl scale-150 stroke-black font-fondamento'
                >
                  {recipe.ingredientName}
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
